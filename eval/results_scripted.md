# Scripted results (postings 01-06): template check and keyword match

Generated 14 Nov 2026 by scripts/template_check.py and scripts/keyword_match.py. Numbers only.
Bug fixed before these runs: template_check treated any `<w:cols>` element as multi-column; it now fails only if num > 1 (logged below).

## Template check
C_01-06 and D_01-06: 12/12 each. The template itself scores 9/12 (sample text, review comments, old date format, as expected).

## Keyword match (% of the frozen list's keywords found in the CV text; total in brackets)
| Posting | A original | B naive | C pipeline | D no auditor |
|---|---|---|---|---|
| 01 [39] | 7.7 | 12.8 | 12.8 | 12.8 |
| 02 [72] | 9.7 | 9.7 | 13.9 | 13.9 |
| 03 [45] | 2.2 | 6.7 | 4.4 | 4.4 |
| 04 [72] | 6.9 | 6.9 | 11.1 | 15.3 |
| 05 [28] | 3.6 | 14.3 | 7.1 | 14.3 |
| 06 [40] | 7.5 | 7.5 | 5.0 | 5.0 |

## Reading (honest)
- C beats A on 5 of 6 postings and beats B on 2 (02, 04); C ties B on 01 and is below B on 03, 05, 06.
- D is at or above C on 04 and 05. The auditor removes unsupported wording, so lower keyword match for C than D is expected, not a defect.
- Absolute values are low because the lists include many keywords the profile cannot honestly support. The match is capped by evidence, not by writing.
- Keyword match is a proxy for alignment only. Nothing here says anything about real ATS screening or interviews.
- Not yet done: must-have coverage by blind rater, human ratings, held-out runs 07 and 08.

## Bug log
- template_check one_column_no_tables false positive (`<w:cols w:space="708"/>` has no num, which means one column). Script fixed; no prompt change.

## Held-out (postings 07 and 08, run once; conditions A and C only)
| Posting | Verdict | Must-have coverage | Audit flags after loop | Template check | Keyword A | Keyword C |
|---|---|---|---|---|---|---|
| 07 Boston Scientific | Skip | 56.0% (hard degree gap) | 0 (2 fixed) | 12/12 | 9.6% | 9.6% |
| 08 Pinterest | Stretch | 75.0% | 0 | 12/12 | 8.8% | 17.5% |
Coverage is from the pipeline's own matcher, not an independent rater. These are the author's gap answers plus a profile the author had already seen; the held-out postings were not blind to the author. Two postings prove nothing; report as counts.

## Independent must-have coverage (postings 01-06; blind subagent rater)
Six fresh subagents, one per posting, each scored four shuffled, name-stripped CVs against the frozen requirement list without condition labels (scripts/make_rating_packets.py, scripts/score_coverage.py; key stays private). Coverage = (S + 0.5 P) / M over must-haves.

| Posting | A | B | C | D |
|---|---|---|---|---|
| 01 | 44.4 | 50.0 | 66.7 | 66.7 |
| 02 | 47.2 | 47.2 | 47.2 | 47.2 |
| 03 | 16.7 | 27.8 | 38.9 | 38.9 |
| 04 | 69.2 | 69.2 | 69.2 | 69.2 |
| 05 | 57.1 | 64.3 | 78.6 | 78.6 |
| 06 | 31.2 | 31.2 | 37.5 | 37.5 |
| mean | 44.3 | 48.3 | 56.4 | 56.4 |

Reading: C is at or above A and B on every posting (ties on 02 and 04); mean 56.4 vs 48.3 (B) and 44.3 (A). C and D tie everywhere, so the auditor did not cost coverage. Caveats: the rater is a model of the same family as the builder, one rater per posting, and CVs are judged from text only, so C and D benefit from the gap answers the author gave while A and B could not use them (that is part of what the pipeline does, but it is not a like-for-like writing comparison). Six postings; counts, no significance tests.
