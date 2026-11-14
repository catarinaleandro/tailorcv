#!/usr/bin/env python3
"""Unblind blind-rater coverage using private/ratings/key.json. Coverage = (S + 0.5 P) / M over must-have requirements.
Prints a table and writes private/ratings/coverage_scores.json."""
import json
key = json.load(open('private/ratings/key.json')); res = {}
print('posting  A     B     C     D   (must-have coverage %)')
for n in sorted(key):
    req = json.load(open(f'eval/frozen_requirements/{n}.json'))['requirements']
    must = [r['id'] for r in req if r['type'] == 'must_have']
    cov = json.load(open(f'private/ratings/coverage_{n}.json'))
    row = {}
    for code, cond in key[n].items():
        st = [cov[code].get(i, 'GAP') for i in must]
        row[cond] = round(100 * (st.count('SUPPORTED') + 0.5 * st.count('PARTIAL')) / len(must), 1)
    res[n] = row
    print(n, '   ', '  '.join(f"{row[c]:5}" for c in 'ABCD'))
avg = {c: round(sum(res[n][c] for n in res) / len(res), 1) for c in 'ABCD'}
print('mean   ', '  '.join(f"{avg[c]:5}" for c in 'ABCD'))
res['mean'] = avg; json.dump(res, open('private/ratings/coverage_scores.json', 'w'), indent=1)
