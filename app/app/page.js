'use client';
import { useEffect, useState } from 'react';
import { estimateLines, MAX_LINES } from '../lib/logic.js';

const KEY = 'tailorcv.profile.v1';
const FIELDS = [['name', 'Full name'], ['email', 'Email'], ['phone', 'Phone'], ['linkedin', 'LinkedIn URL'], ['city', 'City and state (for example New York, NY)']];
const BOXES = [['education', 'Education', 'Paste everything about your education, in any format.'], ['experience', 'Work experience', 'Jobs, internships, self-employment: what you did, with any numbers.'], ['skills', 'Skills', 'Tools, methods, languages you speak.'], ['extra', 'Extra', 'Projects, leadership, achievements, anything else.']];

const safeGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const safeSet = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
const safeDel = (k) => { try { localStorage.removeItem(k); } catch {} };

export default function Home() {
  const [code, setCode] = useState('');
  const [fields, setFields] = useState({ name: '', email: '', phone: '', linkedin: '', city: '', education: '', experience: '', skills: '', extra: '' });
  const [profile, setProfile] = useState(null);
  const [profileText, setProfileText] = useState('');
  const [url, setUrl] = useState('');
  const [posting, setPosting] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [matchRes, setMatchRes] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [plan, setPlan] = useState(null);
  const [cv, setCv] = useState(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [needPaste, setNeedPaste] = useState(false);

  useEffect(() => {
    try { setCode(sessionStorage.getItem('tailorcv.code') || ''); } catch {}
    const saved = safeGet(KEY);
    if (saved) { try { const p = JSON.parse(saved); setProfile(p); setProfileText(JSON.stringify(p, null, 2)); } catch {} }
  }, []);

  async function api(step, payload = {}) {
    const r = await fetch('/api/step', { method: 'POST', headers: { 'content-type': 'application/json', 'x-access-code': code }, body: JSON.stringify({ step, ...payload }) });
    let d; try { d = await r.json(); } catch { throw new Error('The server returned an unreadable answer (it may have timed out). Try again.'); }
    if (!r.ok || d.error) { const e = new Error(d.message || d.error || 'Request failed'); e.code = d.error; throw e; }
    return d;
  }
  const run = async (label, fn) => { setError(''); setBusy(label); try { await fn(); } catch (e) { setError(e.message); } finally { setBusy(''); } };
  const saveCode = (v) => { setCode(v); try { sessionStorage.setItem('tailorcv.code', v); } catch {} };
  const saveProfile = (p) => { setProfile(p); setProfileText(JSON.stringify(p, null, 2)); safeSet(KEY, JSON.stringify(p)); };

  const structure = () => run('Structuring your profile…', async () => {
    const d = await api('parseProfile', { fields });
    setProfile(d.profile); setProfileText(JSON.stringify(d.profile, null, 2));
  });
  const confirmProfile = () => { try { saveProfile(JSON.parse(profileText)); setError(''); } catch { setError('The profile text is not valid JSON. Fix it or re-run structuring.'); } };

  const analyseJob = () => run('Reading the posting and matching it to your evidence…', async () => {
    setAnalysis(null); setMatchRes(null); setQuestions(null); setPlan(null); setCv(null); setNeedPaste(false);
    let a;
    try { a = await api('analyze', { url: posting.trim() ? '' : url.trim(), text: posting }); }
    catch (e) { if (e.code === 'fetch_failed' || e.code === 'too_short') setNeedPaste(true); throw e; }
    setAnalysis(a.analysis);
    const m = await api('match', { analysis: a.analysis, profile });
    setMatchRes(m);
    const g = await api('gapQuestions', { analysis: a.analysis, profile, matches: m.matches });
    setQuestions(g.questions); setAnswers({});
  });
  // analyze returns {error} with status 200 for fetch failures; api() throws on d.error, so handle by code
  const analyseJobSafe = async () => { try { await analyseJob(); } catch {} };

  const submitAnswers = () => run('Saving your answers and re-matching…', async () => {
    const { profile: p2 } = await api('applyAnswers', { profile, questions, answers });
    saveProfile(p2);
    const m = await api('match', { analysis, profile: p2 });
    setMatchRes(m); setQuestions([]);
    const pl = await api('gapPlan', { analysis, profile: p2, matches: m.matches });
    setPlan(pl.plan);
  });
  const skipAnswers = () => run('Preparing your result…', async () => {
    setQuestions([]);
    const pl = await api('gapPlan', { analysis, profile, matches: matchRes.matches });
    setPlan(pl.plan);
  });

  const makeCv = () => run('Building the CV…', async () => {
    setCv(null);
    const started = Date.now(); const log = [];
    let { spec } = await api('build', { analysis, profile, matches: matchRes.matches });
    let flagged = []; let rounds = 0; let firstFlags = null; let lineCount = 0;
    for (; rounds < 3; ) {
      setBusy(`Auditing every line (round ${rounds + 1})…`);
      const a = await api('audit', { spec, profile });
      rounds += 1; lineCount = a.lines; flagged = a.flagged;
      if (firstFlags === null) firstFlags = flagged.length;
      if (!flagged.length) break;
      if (rounds === 3) break;
      setBusy('Rewriting flagged lines…');
      ({ spec } = await api('fix', { spec, profile, flagged }));
    }
    let trimmed = 0;
    while (estimateLines(spec) > MAX_LINES && trimmed < 2) {
      setBusy('Shortening to one page…'); trimmed += 1;
      ({ spec } = await api('fix', { spec, profile, trim: true, analysis }));
      setBusy('Re-auditing after shortening…');
      const a = await api('audit', { spec, profile }); flagged = a.flagged; lineCount = a.lines;
    }
    setBusy('Running final checks…');
    const c = await api('checks', { spec, profile, analysis });
    let docx = null; let tcheck = null; let docxError = '';
    if (!c.leaks.length) {
      const r = await fetch('/api/cv_docx', { method: 'POST', headers: { 'content-type': 'application/json', 'x-access-code': code }, body: JSON.stringify({ spec }) });
      const d = await r.json().catch(() => ({}));
      if (r.ok) { docx = d.docx_b64; tcheck = d.template_check; } else docxError = d.message || 'The Word file could not be built.';
    }
    setCv({ spec, flagged, rounds, firstFlags, lineCount, leaks: c.leaks, keywords: c.keywords, docx, tcheck, docxError, est: estimateLines(spec), trimmed, secs: Math.round((Date.now() - started) / 1000) });
  });

  const download = () => {
    const bin = atob(cv.docx); const bytes = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `CV_${(analysis?.company || 'tailored').replace(/[^A-Za-z0-9]+/g, '_')}.docx`; a.click(); URL.revokeObjectURL(a.href);
  };
  const exportData = () => { const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'tailorcv-profile.json'; a.click(); URL.revokeObjectURL(a.href); };
  const deleteData = () => { if (confirm('Delete your saved profile from this browser?')) { safeDel(KEY); setProfile(null); setProfileText(''); setAnalysis(null); setMatchRes(null); setQuestions(null); setPlan(null); setCv(null); } };

  const byId = Object.fromEntries((analysis?.requirements || []).map((r) => [r.id, r]));
  const v = matchRes?.verdict;

  return (
    <main>
      <h1>TailorCV</h1>
      <p className="muted">Builds a tailored one-page CV from your own evidence, asks about gaps, and audits every line against what you wrote. It improves requirement alignment and traceability. It cannot tell you whether a company&apos;s screening will accept a CV, and it does not promise interviews.</p>
      <div className="banner">Privacy: your profile is saved only in this browser (you can export or delete it below). Your text is sent to the Anthropic API to be processed and is not stored by this app. Do not paste ID numbers, passport numbers, bank or health details.</div>

      <section className="card" aria-labelledby="h-access">
        <h2 id="h-access">Access code</h2>
        <label htmlFor="code">Code from the app owner</label>
        <input id="code" type="password" autoComplete="off" value={code} onChange={(e) => saveCode(e.target.value)} />
      </section>

      <section className="card" aria-labelledby="h-profile">
        <h2 id="h-profile">1. Your profile {profile && <span className="pill">saved in this browser</span>}</h2>
        <div className="grid">{FIELDS.map(([k, l]) => (<div key={k}><label htmlFor={k}>{l}</label><input id={k} value={fields[k]} onChange={(e) => setFields({ ...fields, [k]: e.target.value })} /></div>))}</div>
        {BOXES.map(([k, l, h]) => (<div key={k}><label htmlFor={k}>{l}</label><textarea id={k} placeholder={h} value={fields[k]} onChange={(e) => setFields({ ...fields, [k]: e.target.value })} /></div>))}
        <button onClick={structure} disabled={!code || !!busy || !fields.name}>Structure my profile</button>
        {profile && (<>
          <h3>Check the structured profile</h3>
          <p className="muted">Correct anything wrong. Nothing is used until you save. Every CV line will cite these entries.</p>
          <label htmlFor="ptext">Profile (editable)</label>
          <textarea id="ptext" style={{ minHeight: 240, fontFamily: 'monospace', fontSize: '.85rem' }} value={profileText} onChange={(e) => setProfileText(e.target.value)} />
          <button onClick={confirmProfile}>Save profile</button>
          <button className="secondary" onClick={exportData}>Export my data</button>
          <button className="danger" onClick={deleteData}>Delete my data</button>
        </>)}
      </section>

      <section className="card" aria-labelledby="h-job">
        <h2 id="h-job">2. The job</h2>
        <label htmlFor="url">Link to the posting</label>
        <input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
        <label htmlFor="posting">Or paste the posting text {needPaste && <span className="err">(the link could not be read; paste it here)</span>}</label>
        <textarea id="posting" value={posting} onChange={(e) => setPosting(e.target.value)} />
        <button onClick={analyseJobSafe} disabled={!code || !profile || !!busy || !(url.trim() || posting.trim())}>Analyse the job</button>
        {!profile && <p className="muted">Save a profile first.</p>}
      </section>

      {busy && <p className="status" role="status">{busy}</p>}
      {error && <p className="err" role="alert">{error}</p>}

      {analysis && (
        <section className="card" aria-labelledby="h-reqs">
          <h2 id="h-reqs">{analysis.title} at {analysis.company}</h2>
          <p className="muted">{analysis.location || analysis.country || ''}</p>
          <h3>Requirements and how your evidence matches</h3>
          <table><thead><tr><th>#</th><th>Requirement</th><th>Type</th><th>Match</th></tr></thead><tbody>
            {(analysis.requirements || []).map((r) => { const m = matchRes?.matches?.find((x) => x.requirement_id === r.id); return (
              <tr key={r.id}><td>{r.id}</td><td>{r.text}{r.hard && <> <span className="pill">hard</span></>}</td><td>{r.type === 'must_have' ? 'must-have' : 'nice-to-have'}</td><td>{m ? m.status : '…'}</td></tr>); })}
          </tbody></table>
          <h3>Keywords</h3><p>{(analysis.keywords || []).join(', ')}</p>
        </section>
      )}

      {questions && questions.length > 0 && (
        <section className="card" aria-labelledby="h-q">
          <h2 id="h-q">3. Questions about gaps</h2>
          <p className="muted">Answer with what you really did. Skip any you cannot answer; &quot;I don&apos;t have this&quot; is a fine answer. Your words are saved as written.</p>
          {questions.map((q) => (<div key={q.id}>
            <label htmlFor={q.id}>{q.question}</label>
            <textarea id={q.id} disabled={answers[q.id]?.none} value={answers[q.id]?.text || ''} onChange={(e) => setAnswers({ ...answers, [q.id]: { ...answers[q.id], text: e.target.value } })} />
            <label style={{ fontWeight: 400 }}><input type="checkbox" style={{ width: 'auto', marginRight: 8 }} checked={!!answers[q.id]?.none} onChange={(e) => setAnswers({ ...answers, [q.id]: { text: '', none: e.target.checked } })} />I don&apos;t have this</label>
          </div>))}
          <button onClick={submitAnswers} disabled={!!busy}>Save answers and re-check</button>
          <button className="secondary" onClick={skipAnswers} disabled={!!busy}>Skip the questions</button>
        </section>
      )}

      {v && questions && questions.length === 0 && (
        <section className="card" aria-labelledby="h-v">
          <h2 id="h-v">4. Verdict</h2>
          <p className="verdict">{v.wording}</p>
          <p>Must-have coverage {v.coverage}% ({v.supported} supported and {v.partial} partial of {v.must} must-haves){v.hardGaps.length > 0 && <> · hard requirement not met: {v.hardGaps.map((id) => byId[id]?.text).join('; ')}</>}.</p>
          <p className="muted">Rule: Good fit needs 80% or more with no hard gap; Stretch is 50 to 79%; Poor fit is under 50% or a hard requirement you do not meet. Coverage is the tool&apos;s own estimate from the evidence you gave.</p>
          {plan && plan.length > 0 && (<><h3>What could close the gap in the short term</h3>
            {plan.map((p) => (<div key={p.requirement_id}><p><strong>{p.gap}</strong></p><ul>{(p.actions || []).map((a, i) => <li key={i}>{a.action} <span className="muted">({a.effort})</span></li>)}</ul></div>))}
            <p className="muted">Advice only. Add something to your profile only after you have actually done it.</p></>)}
          <button onClick={makeCv} disabled={!!busy}>Build my CV</button>
        </section>
      )}

      {cv && (
        <section className="card" aria-labelledby="h-cv">
          <h2 id="h-cv">5. Your CV and readiness report</h2>
          {cv.leaks.length > 0 && <p className="err">Blocked: the CV text names {cv.leaks.join(', ')}, which is not an employer, school or this posting&apos;s company.</p>}
          {cv.docxError && <p className="err">{cv.docxError}</p>}
          {cv.docx && <button onClick={download}>Download CV (.docx)</button>}
          <h3>What was checked (and what was not)</h3>
          <table><tbody>
            <tr><th>Unsupported-claim audit</th><td>{cv.flagged.length === 0 ? <span className="ok">0 lines flagged after {cv.rounds} round(s)</span> : <span className="err">{cv.flagged.length} line(s) still flagged after {cv.rounds} rounds. Review them before using this CV.</span>} First draft: {cv.firstFlags} flagged of {cv.lineCount} lines. An automated audit can miss subtle exaggeration: read every line yourself.</td></tr>
            <tr><th>Format</th><td>{cv.tcheck ? `${cv.tcheck.passed} of ${cv.tcheck.total} template checks passed${cv.tcheck.failed.length ? ' (failed: ' + cv.tcheck.failed.join(', ') + ')' : ''}` : 'not run'}. Estimated length: about {cv.est} lines; one page holds roughly {MAX_LINES}. The page count is estimated, not measured: open the file to confirm.</td></tr>
            <tr><th>Company names</th><td>{cv.leaks.length ? 'leak found' : 'no other company names found'}</td></tr>
            <tr><th>Keyword match</th><td>{cv.keywords.matched} of {cv.keywords.total} posting keywords appear in the CV ({cv.keywords.pct}%). Missing keywords are ones your evidence does not support or that were not relevant.</td></tr>
            <tr><th>Real screening</th><td>Not tested. No tool can know whether a company&apos;s screening or a recruiter will accept this CV.</td></tr>
          </tbody></table>
          {cv.flagged.length > 0 && <pre>{JSON.stringify(cv.flagged, null, 1)}</pre>}
          <h3>Summary line</h3><p>{cv.spec.summary?.text}</p>
          <p className="muted">Built in about {cv.secs} seconds.</p>
        </section>
      )}
    </main>
  );
}
