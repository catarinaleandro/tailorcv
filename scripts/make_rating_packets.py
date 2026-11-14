#!/usr/bin/env python3
"""Build blind rating packets. For each posting 01-06: the four CVs (A original, B naive, C pipeline, D no auditor)
as plain text with name and contact line removed, under random codes. Writes private/ratings/packet/NN_X.txt
and private/ratings/key.json (condition per code; never give the key to raters). Seed fixed for reproducibility."""
import random, json, re, os
random.seed(20261114)
out = 'private/ratings/packet'; os.makedirs(out, exist_ok=True)
def clean(t):
    lines = [l for l in t.splitlines()]
    # drop the name line and contact line (first lines containing the name or an '@')
    keep = []
    for i, l in enumerate(lines):
        if i < 3 and ('@' in l or l.strip() == 'the author'): continue
        keep.append(l.replace('the author', '[NAME]'))
    return '\n'.join(keep).strip() + '\n'
key = {}
for n in ['01', '02', '03', '04', '05', '06']:
    files = {'A': 'private/outputs/A_original_cv.txt', 'B': f'private/outputs/B_{n}.txt',
             'C': f'private/outputs/C_{n}.txt', 'D': f'private/outputs/D_{n}.txt'}
    codes = ['P', 'Q', 'R', 'S']; random.shuffle(codes)
    key[n] = {}
    for cond, code in zip('ABCD', codes):
        txt = clean(open(files[cond], encoding='utf8').read())
        txt = re.sub(r'\s*\|\|\s*', '  --  ', txt)  # same tab rendering for all
        open(f'{out}/{n}_{code}.txt', 'w', encoding='utf8').write(txt)
        key[n][code] = cond
json.dump(key, open('private/ratings/key.json', 'w'), indent=1)
print('packets', len(os.listdir(out)))
