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

Verdict 01 (pipeline): Skip, because a hard requirement (5+ years program or project management) is a confirmed gap. Matches the pre-registered verdict.
