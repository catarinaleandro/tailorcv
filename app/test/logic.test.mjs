import test from 'node:test';
import assert from 'node:assert';
import { experienceYears, leakCheck, keywordMatch, verdict, estimateLines } from '../lib/logic.js';

const prof = { experience: [
  { org: 'A', dates: '2023-01 to present' }, { org: 'B', dates: '2026-07 to present' }, { org: 'C', dates: '2023-08' }, { org: 'D', dates: '2025-07 to 2025-08' } ],
  education: [{ org: 'IE University' }], employer_scoped: [{ company: 'Company A', text: 'x' }] };

test('experience years matches scripts/experience_years.py (47 months to 2026-11)', () => {
  assert.equal(experienceYears(prof, '2026-11').months, 47);
  assert.equal(experienceYears(prof, '2026-11').phrase, '3+ years');
  assert.equal(experienceYears({ experience: [{ dates: '2026-03 to 2026-10' }] }, '2026-11').phrase, '8 months');
});
test('leak check blocks other companies, allows target and employers', () => {
  assert.deepEqual(leakCheck('Interested in Company A and Apple', prof, 'Google').sort(), ['Apple', 'Company A']);
  assert.deepEqual(leakCheck('Interested in Company A', prof, 'Company A'), []);
  assert.deepEqual(leakCheck('Worked at IE University and Google', prof, 'Google'), []);
});
test('keyword match', () => {
  const r = keywordMatch({ keywords: ['Power BI', 'SQL'], requirements: [{ keywords: ['A/B testing'] }] }, 'Built dashboards in power-bi and wrote SQL');
  assert.equal(r.matched, 2); assert.equal(r.total, 3);
});
test('verdict follows fit rubric', () => {
  const an = { requirements: [{ id: 'r1', type: 'must_have', hard: false }, { id: 'r2', type: 'must_have', hard: true }, { id: 'r3', type: 'nice_to_have', hard: false }] };
  assert.equal(verdict(an, [{ requirement_id: 'r1', status: 'SUPPORTED' }, { requirement_id: 'r2', status: 'GAP' }]).label, 'Skip');
  assert.equal(verdict(an, [{ requirement_id: 'r1', status: 'SUPPORTED' }, { requirement_id: 'r2', status: 'SUPPORTED' }]).label, 'Apply');
  assert.equal(verdict(an, [{ requirement_id: 'r1', status: 'PARTIAL' }, { requirement_id: 'r2', status: 'SUPPORTED' }]).label, 'Stretch');
  assert.equal(verdict(an, [{ requirement_id: 'r1', status: 'GAP' }, { requirement_id: 'r2', status: 'PARTIAL' }]).label, 'Skip');
});
