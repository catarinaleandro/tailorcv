import test from 'node:test';
import assert from 'node:assert';
import http from 'node:http';

// Stub of the Anthropic API: checks that the app sends the pipeline prompts and handles JSON replies. Tests plumbing, not model quality.
test('analyze and match steps call the model with the pipeline prompts and parse JSON', async () => {
  const seen = [];
  const srv = http.createServer((req, res) => {
    let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => {
      const body = JSON.parse(b); seen.push(body.system.slice(0, 60));
      const sys = body.system;
      const out = sys.startsWith('You analyze one job posting')
        ? '```json\n{"title":"Analyst","company":"Acme","seniority":"","requirements":[{"id":"r1","text":"SQL","type":"must_have","hard":false,"keywords":["SQL"]}],"keywords":["SQL"],"country":"United States","location":"New York"}\n```'
        : '{"matches":[{"requirement_id":"r1","status":"SUPPORTED","evidence_ids":["sk_02"],"reason":"x"},{"requirement_id":"r9","status":"GAP","evidence_ids":[],"reason":"unknown id dropped"}]}';
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ content: [{ type: 'text', text: out }], usage: { input_tokens: 1, output_tokens: 1 } }));
    });
  });
  await new Promise((r) => srv.listen(0, r));
  process.env.ANTHROPIC_BASE_URL = 'http://127.0.0.1:' + srv.address().port;
  process.env.ANTHROPIC_API_KEY = 'test';
  const { handlers } = await import('../lib/steps.js');
  const a = await handlers.analyze({ text: 'x'.repeat(300) });
  assert.equal(a.analysis.company, 'Acme');
  const m = await handlers.match({ analysis: a.analysis, profile: { skills: [{ id: 'sk_02', name: 'SQL' }] } });
  assert.equal(m.matches.length, 1);
  assert.equal(m.verdict.label, 'Apply');
  assert.ok(seen[0].startsWith('You analyze one job posting'));
  srv.close();
});

test('applyAnswers saves the person\'s words verbatim and records gaps', async () => {
  const { handlers } = await import('../lib/steps.js');
  const r = handlers.applyAnswers({ profile: {}, questions: [{ id: 'q1', requirement_id: 'r1', question: 'Q1?' }, { id: 'q2', requirement_id: 'r2', question: 'Q2?' }], answers: { q1: { text: ' I ran a stall ' }, q2: { none: true } } });
  assert.equal(r.profile.confirmed_evidence[0].text, 'I ran a stall');
  assert.equal(r.profile.confirmed_evidence[0].source, 'user_confirmed');
  assert.equal(r.profile.confirmed_gaps.length, 1);
});
