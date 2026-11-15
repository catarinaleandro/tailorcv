# App test log

## 15 Nov 2026, about 18:03 ET: one end-to-end run on the deployed app
Made-up persona (Alex Rivera, fictional, example.com email) and a made-up posting for a fictional company. No real personal data. Run by script against the live deployment; the access code and API key are not recorded here.

| Step | Result | Seconds |
|---|---|---|
| parseProfile | ok (experience, projects, education, skills, languages, leadership found) | 5.6 |
| analyze | ok (10 requirements, country United States) | 6.9 |
| match | ok, verdict Skip at 64.3% coverage (a hard requirement, US work eligibility, had no evidence in the persona) | 6.6 |
| gapQuestions | ok, 5 questions | 11.0 |
| applyAnswers, re-match | ok (the test answered question 1 with an unrelated sentence, so the verdict did not change; this tests the plumbing, not the questions) | 12.9 |
| gapPlan | ok, 4 items | 11.1 |
| build | ok, summary used the computed years phrase | 17.1 |
| audit round 1 | 1 of 11 lines flagged | 12.9 |
| fix, audit round 2 | 0 flagged | 6.4 + 10.1 |
| checks | no leaks; keyword match 8 of 23 | 0.1 |
| cv_docx | 200; template check 11 of 12 (failed: date format, because the persona's bachelor dates were years only, "2021 to 2025", which the renderer does not reformat) | n/a |

The resulting .docx converted to 1 page in LibreOffice and followed the template.

## What this does and does not show
- It shows the deployed app works end to end with the real model on one made-up input.
- It does not show quality across users, the usefulness of the gap questions, or anything about real screening. No user has tested it.
- Known issues: year-only dates are printed as written; the page length in the app is estimated, not measured; a posting link is often not readable and needs pasting.
