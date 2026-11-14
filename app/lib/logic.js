// Deterministic helpers (no model calls). Ported from scripts/experience_years.py, scripts/leak_check.py,
// scripts/keyword_match.py and references/fit-rubric.md so the app and the pipeline agree.

const idx = (ym) => { const [y, m] = ym.split('-'); return parseInt(y, 10) * 12 + parseInt(m, 10) - 1; };

export function experienceYears(profile, today = new Date().toISOString().slice(0, 7)) {
  const spans = [];
  for (const e of profile.experience || []) {
    const s = String(e.dates || '').replace(/\(.*?\)/g, '').trim();
    const m = s.match(/^(\d{4}-\d{2})(?:\s+to\s+(present|\d{4}-\d{2}))?$/i);
    if (!m) continue;
    const a = idx(m[1]);
    const b = (m[2] || '').toLowerCase() === 'present' ? idx(today) : idx(m[2] || m[1]);
    spans.push([a, b + 1]);
  }
  spans.sort((x, y) => x[0] - y[0]);
  const merged = [];
  for (const [a, b] of spans) {
    if (merged.length && a <= merged[merged.length - 1][1]) merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], b);
    else merged.push([a, b]);
  }
  const months = merged.reduce((t, [a, b]) => t + (b - a), 0);
  return { months, phrase: months >= 12 ? `${Math.floor(months / 12)}+ years` : `${months} months`, as_of: today };
}

const KNOWN = ['Amazon', 'Capital One', 'Kyndryl', 'Barclays', 'CSS Merge', 'Boston Scientific', 'Pinterest', 'Company A', 'Enter',
  'Google', 'Microsoft', 'Apple', 'Meta', 'Netflix', 'Goldman Sachs', 'JPMorgan', 'McKinsey', 'Deloitte', 'Accenture'];

export function leakCheck(cvText, profile, target) {
  const forbidden = new Set([...KNOWN, ...(profile.employer_scoped || []).map((s) => s.company).filter(Boolean)]);
  const allowed = [String(target || '').toLowerCase()];
  for (const sec of ['experience', 'education', 'leadership']) for (const e of profile[sec] || []) allowed.push(String(e.org || '').toLowerCase());
  const hits = [];
  for (const name of forbidden) {
    const n = name.toLowerCase();
    if (allowed.some((a) => a && (a === n || a.includes(n) || n.includes(a) && a.length > 3))) continue;
    const re = new RegExp('(?<![A-Za-z])' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![A-Za-z])', 'i');
    if (re.test(cvText)) hits.push(name);
  }
  return hits;
}

const norm = (s) => ' ' + String(s).toLowerCase().replace(/-/g, ' ').replace(/[^a-z0-9+#/ ]+/g, ' ').split(/\s+/).filter(Boolean).join(' ') + ' ';

export function keywordMatch(analysis, cvText) {
  const seen = new Set(); const kws = [];
  const all = [...(analysis.keywords || []), ...(analysis.requirements || []).flatMap((r) => r.keywords || [])];
  for (const k of all) { const t = String(k).trim(); if (t && !seen.has(t.toLowerCase())) { seen.add(t.toLowerCase()); kws.push(t); } }
  const cv = norm(cvText);
  const hit = kws.filter((k) => cv.includes(norm(k)));
  return { matched: hit.length, total: kws.length, pct: kws.length ? Math.round((1000 * hit.length) / kws.length) / 10 : 0, missing: kws.filter((k) => !hit.includes(k)) };
}

// references/fit-rubric.md. Returns verdict label used internally (Apply / Stretch / Skip) and the app's wording.
export function verdict(analysis, matches) {
  const byId = Object.fromEntries((analysis.requirements || []).map((r) => [r.id, r]));
  const must = (matches || []).filter((m) => byId[m.requirement_id] && byId[m.requirement_id].type === 'must_have');
  const S = must.filter((m) => m.status === 'SUPPORTED').length;
  const P = must.filter((m) => m.status === 'PARTIAL').length;
  const M = must.length || 1;
  const coverage = (100 * (S + 0.5 * P)) / M;
  const hardGaps = must.filter((m) => m.status === 'GAP' && byId[m.requirement_id].hard).map((m) => m.requirement_id);
  let label;
  if (coverage < 50 || hardGaps.length > 1) label = 'Skip';
  else if (hardGaps.length === 1) label = coverage >= 80 ? 'Stretch' : 'Skip';
  else if (coverage >= 80) label = 'Apply';
  else label = 'Stretch';
  // A single hard gap with Apply-level coverage is a Stretch only if the person could plausibly close it; the app cannot judge that,
  // so any other single hard gap is treated as Skip, matching the rubric's "confirmed gap with no realistic workaround".
  const wording = { Apply: 'Good fit', Stretch: 'Stretch', Skip: 'Poor fit' }[label];
  return { label, wording, coverage: Math.round(coverage * 10) / 10, supported: S, partial: P, must: must.length, hardGaps };
}

// Rough one-page check: estimated printed lines (the real renderer cannot run in the app). Calibrated on 14 CVs of this project.
export function estimateLines(spec) {
  const cap = (t, w) => Math.max(1, Math.ceil(String(t || '').length / w));
  let n = 2; // name + contact
  const sec = (arr, f) => { n += 1; arr.forEach(f); };
  if (spec.summary && spec.summary.text) { n += 1 + cap(spec.summary.text, 108); }
  sec(spec.education || [], (e) => { n += 2 + (e.bullets || []).reduce((t, b) => t + cap(b.text, 104), 0) + 1; });
  sec(spec.experience || [], (e) => { n += 2 + (e.bullets || []).reduce((t, b) => t + cap(b.text, 104), 0) + 1; });
  n += 1 + (spec.skills || []).reduce((t, s) => t + cap((s.label || '') + ': ' + (s.text || ''), 108), 0);
  sec(spec.additional || [], (e) => { n += 1 + (e.bullets || []).reduce((t, b) => t + cap(b.text, 104), 0) + (e.dates ? 1 : 0); });
  return n;
}
export const MAX_LINES = 55; // largest estimate seen on a 1-page CV was 54; smallest on a 2-page draft was 57
