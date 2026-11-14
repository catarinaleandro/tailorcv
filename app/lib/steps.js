import { callClaude, parseJson } from './claude.js';
import * as P from './prompts.js';
import { experienceYears, leakCheck, keywordMatch, verdict } from './logic.js';

const j = (o) => JSON.stringify(o, null, 1);
const SPEC_SHAPE_NOTE = 'Output ONLY the JSON object, no commentary.';

async function jsonCall(system, user, maxTokens) {
  const r = await callClaude(system, user, maxTokens);
  return { data: parseJson(r.text), usage: r.usage, ms: r.ms };
}

// Step 0: free text -> profile JSON. App-only prompt (the CLI pipeline starts from a hand-built profile.yaml).
const PROFILE_PROMPT = `You turn a person's pasted free text into a structured career profile. Output ONLY valid JSON.

Rules (strict):
- Use only what the person wrote. Do not add, infer or improve anything: no new numbers, tools, titles, dates, employers or scope. If something is missing, omit the field.
- Keep their wording for facts; light cleanup of spelling is fine. Split into short bullets, one fact each.
- Every entry and bullet gets a unique id: exp_01, exp_01_b1, proj_01, edu_01, sk_01, lang_01, lead_01, ach_01, course_01, misc_01.
- Dates as YYYY-MM when a month is stated, "YYYY-MM to YYYY-MM", "YYYY-MM to present", or "(expected)" suffix for future end dates. If only a year is given, write the year only.
- Every item has "source": "user_text".
- Put paid work, internships and self-employment under "experience"; projects under "projects"; degrees under "education"; leadership and clubs under "leadership"; certificates, languages and skills where they belong.
- Put any sentence that is written for one named company (for example "I want to join X because") under "employer_scoped" with that company name.

Shape:
{"person":{"name":"","email":"","phone":"","location":"","linkedin":""},
 "experience":[{"id":"","role":"","org":"","org_descriptor":"","location":"","dates":"","source":"user_text","bullets":[{"id":"","text":"","source":"user_text"}]}],
 "projects":[{"id":"","name":"","dates":"","bullets":[{"id":"","text":"","source":"user_text"}]}],
 "education":[{"id":"","degree":"","org":"","location":"","dates":"","source":"user_text","bullets":[{"id":"","text":"","source":"user_text"}]}],
 "skills":[{"id":"","name":"","category":"technical","source":"user_text"}],
 "languages":[{"id":"","name":"","level":"","source":"user_text"}],
 "coursework":[],"leadership":[],"achievements":[],"other":[],"employer_scoped":[{"id":"","company":"","text":"","source":"user_text"}],
 "eligibility":[],"confirmed_evidence":[],"confirmed_gaps":[]}`;

export async function parseProfile({ fields }) {
  const f = fields || {};
  const user = `Name: ${f.name || ''}\nEmail: ${f.email || ''}\nPhone: ${f.phone || ''}\nLinkedIn: ${f.linkedin || ''}\nCity: ${f.city || ''}\n\nEDUCATION:\n${f.education || ''}\n\nWORK EXPERIENCE:\n${f.experience || ''}\n\nSKILLS:\n${f.skills || ''}\n\nEXTRA (projects, leadership, achievements, languages, anything else):\n${f.extra || ''}`;
  const r = await jsonCall(PROFILE_PROMPT, user, 8000);
  const p = r.data;
  p.person = { ...(p.person || {}), name: f.name || p.person?.name || '', email: f.email || '', phone: f.phone || '', linkedin: f.linkedin || '', location: f.city || p.person?.location || '' };
  for (const k of ['experience', 'projects', 'education', 'skills', 'languages', 'coursework', 'leadership', 'achievements', 'other', 'employer_scoped', 'eligibility', 'confirmed_evidence', 'confirmed_gaps']) p[k] = p[k] || [];
  return { profile: p, usage: r.usage, ms: r.ms };
}

// Step 1: posting text (or URL) -> frozen-style analysis.
async function fetchPosting(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (TailorCV; student project)' }, signal: AbortSignal.timeout(15000), redirect: 'follow' });
  if (!res.ok) throw new Error('fetch ' + res.status);
  const html = await res.text();
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

export async function analyze({ url, text }) {
  let posting = (text || '').trim(); let fetched = false;
  if (!posting && url) {
    try { posting = await fetchPosting(url); fetched = true; } catch (e) { return { error: 'fetch_failed', message: 'Could not read that link (many job sites block automated access). Please paste the posting text instead.' }; }
    if (posting.length < 400) return { error: 'fetch_failed', message: 'The page returned too little text. Please paste the posting text instead.' };
  }
  if (posting.length < 200) return { error: 'too_short', message: 'Please paste the full posting text.' };
  posting = posting.slice(0, 30000);
  const extra = '\n\nIn addition to the JSON shape above, add two top-level fields: "country" (the country of the job, or "" if the posting does not say) and "location" (the job location as written). Do not add anything else.';
  const r = await jsonCall(P.analyst + extra, 'POSTING:\n' + posting, 6000);
  return { analysis: r.data, fetched, postingChars: posting.length, usage: r.usage, ms: r.ms };
}

// Step 2: requirements + profile -> SUPPORTED / PARTIAL / GAP.
export async function match({ analysis, profile }) {
  const user = 'REQUIREMENTS (JSON):\n' + j({ requirements: analysis.requirements }) + '\n\nPROFILE (JSON):\n' + j(profile);
  const r = await jsonCall(P.matcher, user, 6000);
  const ids = new Set((analysis.requirements || []).map((x) => x.id));
  const matches = (r.data.matches || []).filter((m) => ids.has(m.requirement_id));
  return { matches, verdict: verdict(analysis, matches), usage: r.usage, ms: r.ms };
}

// Step 3: gap questions per references/gap-questions.md.
export async function gapQuestions({ analysis, profile, matches }) {
  const sys = `You write gap questions for a CV tool. Follow these rules exactly.\n\n${P.gapQuestions}\n\nOutput ONLY valid JSON: {"questions":[{"id":"q1","requirement_id":"r1","trigger":"T1","question":""}]}. At most 5. Rank must-have gaps first. Ask for evidence (what they did, with what result), never a yes/no question. Never ask what the profile already answers. Do not suggest answers.`;
  const byId = Object.fromEntries((analysis.requirements || []).map((x) => [x.id, x]));
  const gaps = (matches || []).filter((m) => m.status !== 'SUPPORTED').map((m) => ({ ...m, requirement: byId[m.requirement_id] }));
  const r = await jsonCall(sys, 'GAPS AND PARTIAL MATCHES:\n' + j(gaps) + '\n\nPROFILE:\n' + j(profile), 3000);
  return { questions: (r.data.questions || []).slice(0, 5), usage: r.usage, ms: r.ms };
}

// Step 3b: the person's answers become profile entries, saved word for word. No model call: nothing can be embellished.
export function applyAnswers({ profile, questions, answers }) {
  const p = JSON.parse(JSON.stringify(profile));
  p.confirmed_evidence = p.confirmed_evidence || []; p.confirmed_gaps = p.confirmed_gaps || [];
  const stamp = Date.now().toString(36);
  (questions || []).forEach((q, i) => {
    const a = (answers && answers[q.id]) || {};
    if (a.none) p.confirmed_gaps.push({ id: `gap_${stamp}_${i + 1}`, requirement_id: q.requirement_id, text: `No evidence for: ${q.question}`, source: 'user_confirmed' });
    else if ((a.text || '').trim()) p.confirmed_evidence.push({ id: `ans_${stamp}_${i + 1}`, requirement_id: q.requirement_id, question: q.question, text: a.text.trim(), source: 'user_confirmed' });
  });
  return { profile: p };
}

// Step 4: close-the-gap advice. Advice only; none of it goes in the CV.
export async function gapPlan({ analysis, profile, matches }) {
  const sys = `You give short-term improvement advice for a job applicant. Output ONLY valid JSON: {"plan":[{"requirement_id":"","gap":"","actions":[{"action":"","effort":""}]}]}.
Rules: only for requirements with status GAP or PARTIAL that are must-haves; 1 to 3 realistic actions each (a course, a small project, volunteering, tool practice) that one person can start within 4 weeks; "effort" is an honest estimate such as "about 10 hours over 2 weeks". Never suggest adding anything to the CV until it has actually been done. Never suggest a hard requirement (a degree, work authorization, years of experience) can be fixed quickly; say plainly it cannot. At most 5 items.`;
  const byId = Object.fromEntries((analysis.requirements || []).map((x) => [x.id, x]));
  const rows = (matches || []).filter((m) => m.status !== 'SUPPORTED' && byId[m.requirement_id]?.type === 'must_have').map((m) => ({ ...m, requirement: byId[m.requirement_id] }));
  const r = await jsonCall(sys, 'OPEN REQUIREMENTS:\n' + j(rows) + '\n\nPROFILE:\n' + j(profile), 3000);
  return { plan: (r.data.plan || []).slice(0, 5), usage: r.usage, ms: r.ms };
}

// Step 5: build the CV spec with the pipeline's builder prompt.
export async function build({ analysis, profile, matches }) {
  const yrs = experienceYears(profile);
  const sys = [P.builder, '\n\n=== docs/CV_FORMAT.md ===\n' + P.cvFormat, '\n\n=== references/ats-rules.md ===\n' + P.atsRules,
    '\n\n=== references/no-fabrication-policy.md ===\n' + P.noFabrication, '\n\n=== skills/professional-summary/SKILL.md ===\n' + P.summarySkill,
    `\n\n=== App notes ===\nYou receive the inputs as text below instead of files. Output the JSON spec only. The profile's "confirmed_evidence" entries are the person's own words from gap questions (ids ans_*): you may cite them and reword them only within what they say. Entries in "confirmed_gaps" must never be claimed. Page limit: keep the whole CV under ${54} printed lines (about 4 bullets per role, 2 per project).`].join('');
  const user = `YEARS OF EXPERIENCE PHRASE (computed, use exactly): ${yrs.phrase}\nPOSTING COMPANY: ${analysis.company || ''}\nPOSTING COUNTRY: ${analysis.country || 'not stated (use US spelling)'}\nPOSTING LOCATION: ${analysis.location || ''}\n\nFROZEN REQUIREMENTS:\n${j(analysis)}\n\nEVIDENCE MATCHES:\n${j({ matches })}\n\nPROFILE:\n${j(profile)}`;
  const r = await jsonCall(sys, user, 8000);
  return { spec: r.data, years: yrs, usage: r.usage, ms: r.ms };
}

// Step 6: independent audit. Sees only the CV text, its sources and the profile.
export function specToText(spec) {
  const out = [];
  if (spec.summary?.text) out.push({ line: spec.summary.text, sources: spec.summary.sources || [], kind: 'summary' });
  for (const e of spec.education || []) for (const b of e.bullets || []) out.push({ line: b.text, sources: b.sources || [], kind: 'education' });
  for (const e of spec.experience || []) for (const b of e.bullets || []) out.push({ line: b.text, sources: b.sources || [], kind: 'experience' });
  for (const s of spec.skills || []) out.push({ line: `${s.label}: ${s.text}`, sources: s.sources || [], kind: 'skills' });
  for (const e of spec.additional || []) for (const b of e.bullets || []) out.push({ line: b.text, sources: b.sources || [], kind: 'additional' });
  return out;
}
export function plainText(spec) {
  const c = spec.contact || {};
  const lines = [spec.name, [c.email, c.phone, c.linkedin, c.location].filter(Boolean).join(' | '), spec.summary?.text || ''];
  for (const e of spec.education || []) lines.push(`${e.org} ${e.location || ''}`, `${e.degree || ''} ${e.dates || ''}`, ...(e.bullets || []).map((b) => b.text));
  for (const e of spec.experience || []) lines.push(`${e.org} ${e.descriptor || ''} ${e.location || ''}`, `${e.role || ''} ${e.dates || ''}`, ...(e.bullets || []).map((b) => b.text));
  for (const s of spec.skills || []) lines.push(`${s.label}: ${s.text}`);
  for (const e of spec.additional || []) lines.push(`${e.title || ''} ${e.dates || ''}`, ...(e.bullets || []).map((b) => b.text));
  return lines.filter(Boolean).join('\n');
}

export async function audit({ spec, profile }) {
  const lines = specToText(spec);
  const user = `CV LINES WITH CITED SOURCES (JSON):\n${j(lines)}\n\nPROFILE:\n${j(profile)}\n\nNO-FABRICATION POLICY:\n${P.noFabrication}`;
  const r = await jsonCall(P.auditor, user, 6000);
  const results = r.data.results || [];
  const flagged = results.filter((x) => x.label && x.label !== 'SUPPORTED');
  return { results, flagged, counts: r.data.counts || null, lines: lines.length, usage: r.usage, ms: r.ms };
}

// Step 6b: fix only the flagged lines, or trim for length. App-side equivalent of the manual rewrite used in the evaluation.
export async function fix({ spec, profile, flagged, trim, analysis }) {
  const sys = `You edit a CV spec (JSON). Output ONLY the full corrected spec JSON in the same shape. ${trim ? 'The CV is too long for one page: remove the lowest-value bullets (those matching the fewest must-have requirements) and shorten wordy bullets until it is clearly shorter. Never add content.' : 'Rewrite ONLY the flagged lines so each says no more than the cited profile entries support: remove the unsupported words, numbers, tools or claims; do not add anything new. Leave every other line exactly as it is.'}\nNever claim anything in confirmed_gaps. Keep sources arrays accurate and only cite ids that exist in the profile.`;
  const user = `${trim ? '' : 'FLAGGED LINES:\n' + j(flagged) + '\n\n'}${trim && analysis ? 'REQUIREMENTS:\n' + j(analysis.requirements) + '\n\n' : ''}SPEC:\n${j(spec)}\n\nPROFILE:\n${j(profile)}`;
  const r = await jsonCall(sys, user, 8000);
  return { spec: r.data, usage: r.usage, ms: r.ms };
}

export function checks({ spec, profile, analysis }) {
  const text = plainText(spec);
  return { leaks: leakCheck(text, profile, analysis.company), keywords: keywordMatch(analysis, text) };
}

export const handlers = { parseProfile, analyze, match, gapQuestions, applyAnswers, gapPlan, build, audit, fix, checks };
