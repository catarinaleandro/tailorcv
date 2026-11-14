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
