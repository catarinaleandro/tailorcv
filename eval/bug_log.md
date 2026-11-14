# Bug and change log

Log every failure and every prompt change. This feeds the error analysis and the honest-limits section.

| When | Posting | What failed | Cause (matcher error / writer embellishment / auditor miss / template issue) | Fix | Changed after seeing results? (yes/no) |
|---|---|---|---|---|---|
| 14 Nov 2026 17:30 | 02 | job-analyst split "Bachelor's or Master's in a quantitative field" (r16) and its stated alternative "Bachelor's in any field plus 4+ years of PM experience" (r17) into two independent hard must-haves, so the alternative shows up as a confirmed hard gap | analyst error: alternatives treated as separate must-haves | None. Frozen requirements and rubric left unchanged. Reported as a limitation: the verdict is Skip on coverage alone (31% < 50%), so the split does not change the outcome here | no |
| 14 Nov 2026 17:30 | 02 | evidence-matcher marked r16 SUPPORTED on the first run and PARTIAL on the re-run, with no change in the relevant evidence (edu_01, edu_02) | matcher variance between runs | None. Both runs kept in private/outputs (C_02_matches_before_answers.json, C_02_matches.json). Reported as a limitation: single-run matcher output is not stable at the borderline | no |

