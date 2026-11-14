# Run log (cost and latency per run)

Real outputs contain personal data and are kept in `private/outputs/` (git-ignored). Only run metadata is committed here.

## Condition A: original CV, unchanged
`private/outputs/A_original_cv.txt` is the author's CV text exactly as supplied on 14 Nov 2026, with one header line added (name, email, phone, LinkedIn, city) because the supplied text had contact details removed. Same file for all postings. No model run, no cost.

## Condition B: naive one-shot prompt
Run Sat 14 Nov 2026 at about 17:05 ET. One fresh subagent per posting (no shared context), same model as the pipeline runs (claude-sonnet-5-5 configured; serving model may differ). Prompt: "Tailor my CV to this job." followed by the paths of the CV file and the posting file. Protocol deviations to disclose: the agent read the two files instead of receiving pasted text, was told to write its output to a file, and was told not to read other files. No profile, no gap questions, no audit, no template.

| Condition | Posting | Subagent tokens (all steps) | Duration (s) |
|---|---|---|---|
| B | 01 | 88587 | 12.9 |
| B | 02 | 90239 | 13.6 |
| B | 03 | 89282 | 15.9 |
| B | 04 | 90984 | 13.2 |
| B | 05 | 90101 | 12.8 |
| B | 06 | 89216 | 12.3 |

Token counts include the subagent's startup context, so they overstate the cost of the prompt itself. Not yet scored.

## Condition C (full pipeline), steps 1-3 so far
Run Sat 14 Nov 2026 from about 17:08 ET. One fresh subagent per step per posting, prompts copied from `agents/job-analyst.md` and `agents/evidence-matcher.md` (the agent files are not registered as named agents in this session, so their text was passed to general-purpose subagents; the subagents also read their input files and wrote their output files). Requirement lists frozen in commit 650160a before any matching.

| Step | Posting | Subagent tokens | Duration (s) |
|---|---|---|---|
| job-analyst | 01 | 86925 | 8.8 |
| job-analyst | 02 | 90896 | 21.6 |
| job-analyst | 03 | 88570 | 18.3 |
| job-analyst | 04 | 91332 | 20.4 |
| job-analyst | 05 | 88907 | 11.9 |
| job-analyst | 06 | 88420 | 13.7 |
| evidence-matcher | 01 | 90973 | 16.1 |
| evidence-matcher | 02 | 93128 | 20.5 |
| evidence-matcher | 03 | 90160 | 9.7 |
| evidence-matcher | 04 | 93638 | 25.4 |
| evidence-matcher | 05 | 90415 | 13.2 |
| evidence-matcher | 06 | 90415 | 11.1 |
| evidence-matcher (re-run after answers) | 01 | 91710 | 17.8 |

### Gap questions (tracked per references/gap-questions.md rule 7)
| Posting | Questions asked | Produced a usable new entry | Confirmed gaps | Coverage before answers | Coverage after |
|---|---|---|---|---|---|
| 01 | 5 | 4 | 1 (plus 1 partial) | 39% | 56% |
| 02 | 5 | 3 | 2 | 28% | 31% |
| 03 | 4 | 3 (two without detail) | 1 (plus 1 known from the pre-registration message) | 17% | 28% |
| 04 | 5 | 4 | 2 | 65% | 85% |
| 05 | 3 | 3 (two with little detail) | 0 | 50% | 64% |
| 06 | 4 | 0 | 4 | 19% | 25% |
| Total | 26 | 17 | 10 (plus 2 from earlier messages) | | |

Verdict 01 (pipeline): Skip, because a hard requirement (5+ years program or project management) is a confirmed gap. Matches the pre-registered verdict.

Verdict 02 (pipeline): Skip on coverage (31% of 18 must-haves, under the 50% threshold). Pre-registered verdict was Apply: a disagreement, reported as is. Evidence-matcher re-run for 02: 94806 tokens, 26.4 s.

Verdict 03 (pipeline): Skip (28% of 9 must-haves, no hard-requirement flag). Matches the pre-registered verdict. Evidence-matcher re-run for 03: 91380 tokens, 10.2 s.

Verdict 04 (pipeline): Apply (85% of 13 must-haves, no confirmed hard-requirement gap; the degree-field requirement is only PARTIAL). Matches the pre-registered verdict. Evidence-matcher runs for 04 after answers: first run 95184 tokens, 22.0 s (discarded, see bug log); valid re-run 95437 tokens, 23.3 s.

Verdict 05 (pipeline): Stretch (64% of 7 must-haves, no confirmed hard-requirement gap; the UK right-to-work condition is only PARTIAL). Matches the pre-registered verdict. Evidence-matcher re-run for 05: 92818 tokens, 14.8 s.
Verdict 06 (pipeline): Skip (25% of 8 must-haves, under the 50% threshold). Pre-registered verdict was Stretch: a disagreement, reported as is. Evidence-matcher re-run for 06: 92747 tokens, 9.6 s.

### Verdict agreement so far (pipeline vs pre-registered, postings 01-06)
| Posting | Pre-registered | Pipeline | Coverage | Agree |
|---|---|---|---|---|
| 01 | Skip | Skip | 56% | yes |
| 02 | Apply | Skip | 31% | no |
| 03 | Skip | Skip | 28% | yes |
| 04 | Apply | Apply | 85% | yes |
| 05 | Stretch | Stretch | 64% | yes |
| 06 | Stretch | Skip | 25% | no |
Agreement: 4 of 6. Both disagreements are cases where the pipeline was stricter than the author. Coverage and verdict were computed from the matcher output with the fixed rubric; nothing was changed after seeing these results.

## Condition D and C: CV build and audit
Run Sat 14 Nov 2026 from about 17:45 ET. One builder subagent per posting (agents/cv-builder.md; output spec rendered into sample/IENYC_CV_Template.docx by scripts/build_cv.py; all six CVs are 1 page). Condition D is the builder's first draft with no audit. Condition C is the same CV after the auditor loop (rewrite flagged lines, audit again, stop at zero flags or 3 rounds). Posting country was not stated in 01, 03 and 06, so US spelling was used; 05 (London) used British spelling. Company-leak check (scripts/leak_check.py): no leaks in any D or C CV.

| Step | Posting | Subagent tokens | Duration (s) |
|---|---|---|---|
| cv-builder (D) | 01 | 103503 | 34.5 |
| cv-builder (D) | 02 | 103387 | 36.8 |
| cv-builder (D) | 03 | 100371 | 20.3 |
| cv-builder (D) | 04 | 104250 | 33.7 |
| cv-builder (D) | 05 | 101264 | 26.2 |
| cv-builder (D) | 06 | 102620 | 33.8 |
| audit round 1 | 01 to 06 | 97224, 97283, 96163, 97277, 97504, 96582 | 23.1, 24.9, 21.5, 22.5, 22.5, 18.2 |
| audit round 2 | 02, 04, 05 | 97402, 97346, 97022 | 25.6, 23.7, 19.5 |
| audit round 3 | 02 | 96479 | 18.3 |

Rewrites between audit rounds were made by the orchestrator (the assistant), not by the builder subagent: summary phrases removed or softened, one tense fixed, citations corrected.

### Auditor results (lines audited = bullets, summary sentences and skills lines)
| Posting | D flagged (round 1) | Lines | Rounds to zero flags (C) |
|---|---|---|---|
| 01 | 0 | 15 | 1 |
| 02 | 2 overstated | 15 | 3 |
| 03 | 0 | 17 | 1 |
| 04 | 1 overstated, 1 unsupported | 17 | 2 |
| 05 | 1 overstated | 17 | 2 |
| 06 | 0 | 17 | 1 |
D: 5 flagged lines of 98 (5.1%). C: 0 flagged lines after the loop. The auditor's zero-flag result is not proof of zero fabrication: manual line-by-line checks of 3 CVs are still to be done and recorded.


## Held-out postings 07 (Boston Scientific) and 08 (Pinterest), run once
Sat 14 Nov 2026 from about 18:00 ET. Requirement lists frozen in commit 8073361 before matching (analyst: 26 and 12 requirements). Matcher before gap answers: 07 = 7 SUPPORTED / 11 PARTIAL / 8 GAP; 08 = 5 / 7 / 0. Provenance: the author read both postings before giving gap answers, and the assistant skimmed the 07 head and tail during extraction, so these are held-out from the prompts, not blind to the people. Author's first gap answer for 08 was "I believe I have everything", which names no evidence and cannot be recorded; specific questions were asked instead.
