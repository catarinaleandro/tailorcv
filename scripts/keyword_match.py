#!/usr/bin/env python3
"""Deterministic keyword match: share of a posting's keywords (from the frozen requirements JSON)
that appear in a CV text file. Usage: python3 scripts/keyword_match.py FROZEN.json CV.txt
Prints JSON {matched, total, pct, missing}. A proxy for alignment, not proof of anything about ATS."""
import sys, json, re
req = json.load(open(sys.argv[1], encoding='utf8'))
cv = open(sys.argv[2], encoding='utf8').read()
norm = lambda s: re.sub(r'[^a-z0-9+#/ ]+', ' ', s.lower().replace('-', ' ')).split()
cv_t = ' ' + ' '.join(norm(cv)) + ' '
kws = []
for k in req.get('keywords', []) + [k for r in req['requirements'] for k in r.get('keywords', [])]:
    if k.strip() and k.strip().lower() not in [x.lower() for x in kws]:
        kws.append(k.strip())
hit = [k for k in kws if ' ' + ' '.join(norm(k)) + ' ' in cv_t]
miss = [k for k in kws if k not in hit]
print(json.dumps({'matched': len(hit), 'total': len(kws), 'pct': round(100 * len(hit) / max(1, len(kws)), 1), 'missing': miss}))
