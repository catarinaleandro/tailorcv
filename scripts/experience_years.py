#!/usr/bin/env python3
"""Years of experience from profile.yaml: union of `experience` date ranges up to today.
Usage: python3 scripts/experience_years.py PROFILE.yaml [YYYY-MM today]. Prints JSON."""
import sys, json, re, yaml, datetime
prof = yaml.safe_load(open(sys.argv[1], encoding='utf8'))
today = sys.argv[2] if len(sys.argv) > 2 else datetime.date.today().strftime('%Y-%m')
def idx(ym): y, m = ym.split('-'); return int(y) * 12 + int(m) - 1
spans = []
for e in prof.get('experience', []):
    s = re.sub(r'\(.*?\)', '', str(e.get('dates', ''))).strip()
    m = re.fullmatch(r'(\d{4}-\d{2})(?:\s+to\s+(present|\d{4}-\d{2}))?', s, flags=re.I)
    if not m: continue
    a = idx(m.group(1)); b = idx(today) if (m.group(2) or '').lower() == 'present' else idx(m.group(2) or m.group(1))
    spans.append((a, b + 1))   # inclusive of the end month
spans.sort(); merged = []
for a, b in spans:
    if merged and a <= merged[-1][1]: merged[-1][1] = max(merged[-1][1], b)
    else: merged.append([a, b])
months = sum(b - a for a, b in merged)
print(json.dumps({'months': months, 'years_floor': months // 12, 'phrase': (f"{months // 12}+ years" if months >= 12 else f"{months} months"), 'as_of': today}))
