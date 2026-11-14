#!/usr/bin/env python3
"""Company-leak check. Usage: python3 scripts/leak_check.py CV_TEXT.txt PROFILE.yaml "Target Company".
Fails (exit 1) if the CV names a company that is employer-scoped to someone else or is another
posting's company, unless that name is the target company or an employer/school in the profile."""
import sys, re, json, yaml
cv = open(sys.argv[1], encoding='utf8').read(); prof = yaml.safe_load(open(sys.argv[2], encoding='utf8')); target = sys.argv[3]
KNOWN = ['Amazon', 'Capital One', 'Kyndryl', 'Barclays', 'CSS Merge', 'Boston Scientific', 'Pinterest', 'Company A', 'Enter']
forbidden = set(KNOWN) | {s['company'] for s in prof.get('employer_scoped', [])}
allowed = {target.lower()}
for sec in ('experience', 'education', 'leadership'):
    for e in prof.get(sec, []):
        allowed.add(str(e.get('org', '')).lower())
hits = []
for name in forbidden:
    if name.lower() in allowed or any(name.lower() in a for a in allowed if a):
        continue
    if re.search(r'(?<![A-Za-z])' + re.escape(name) + r'(?![A-Za-z])', cv, flags=re.I):
        hits.append(name)
print(json.dumps({'target': target, 'leaks': hits}))
sys.exit(1 if hits else 0)
