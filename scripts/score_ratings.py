#!/usr/bin/env python3
"""Unblind human ratings (private/ratings/rater1.csv, rater2.csv) with key.json. Prints mean score and mean rank per condition,
per rater and pooled, and how often each condition was ranked best (ties are possible because C and D can be identical)."""
import csv, json, statistics as st
key = json.load(open('private/ratings/key.json'))
data = {}
for r in ('rater1', 'rater2'):
    for row in csv.DictReader(open(f'private/ratings/{r}.csv', encoding='utf8')):
        c = key[row['posting']][row['cv']]
        data.setdefault(r, {}).setdefault(c, []).append((int(row['score_1_to_5']), int(row['rank_1_to_4']), row['posting']))
def line(label, rows):
    print(f"{label:8}", '  '.join(f"{c}: score {st.mean(x[0] for x in rows[c]):.2f} rank {st.mean(x[1] for x in rows[c]):.2f} best {sum(x[1]==1 for x in rows[c])}" for c in 'ABCD'))
for r in data: line(r, data[r])
line('pooled', {c: data['rater1'][c] + data['rater2'][c] for c in 'ABCD'})
# agreement
a = {(x[2], c): (x[0], x[1]) for c in 'ABCD' for x in data['rater1'][c]}
b = {(x[2], c): (x[0], x[1]) for c in 'ABCD' for x in data['rater2'][c]}
same_score = sum(a[k][0] == b[k][0] for k in a); within1 = sum(abs(a[k][0] - b[k][0]) <= 1 for k in a)
print('score agreement exact', same_score, 'of', len(a), '| within 1 point', within1)
for c in 'ABCD': pass
print('identical-CV check, key per posting:'); [print(n, key[n]) for n in sorted(key)]
