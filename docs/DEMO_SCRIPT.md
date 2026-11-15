# Demo script (aim for 4:00, limit 5:00)

**Rules for the recording**
- Use only the synthetic persona (Alex Rivera, `sample/profile.yaml`) on screen. Never show `private/`, your real CV, your name in a CV, rater files, or the Vercel env variables page.
- Say "I", say what was measured, never say the tool beats ATS screeners or gets interviews.
- Numbers below are from `eval/results_scripted.md` and `eval/limits.md`. Re-read them before recording and fix anything that differs.

## Before you hit record (10 min)
- [ ] Open in tabs: the repo README, `sample/profile.yaml`, the results table, the web app, a finished sample .docx.
- [ ] Do one practice run in the app with the made-up persona so you know the timing (each step is 5 to 17 seconds; the full run is about 2 minutes). Use the app's "paste text" option for the posting, not a link.
- [ ] Have a pre-run .docx ready in case the live run stalls. Say it is pre-run if you use it.
- [ ] Check audio with a 10 second test. Do two takes.

## Script
| Time | Show | Say |
|---|---|---|
| 0:00-0:30 | Original CV next to a tailored one | "Tailoring a CV per posting is slow, generic CVs miss the posting's requirements, and AI tools tend to invent experience. TailorCV tailors from facts I confirm, and checks every line." |
| 0:30-1:00 | `sample/profile.yaml`, then the pipeline list in the README | "I enter my facts once. Every line has an ID and a source. Agents: job analyst, evidence matcher, CV builder, and a separate fabrication auditor that never saw how the CV was written." |
| 1:00-2:30 | Web app, live run with Alex Rivera | Paste the profile, paste a posting, show the requirement match, answer the gap questions, show the verdict (Apply, Stretch or Skip with the reason), build, show the audit loop, open the .docx. Say: "Gap questions only record facts I can state. A vague 'I have everything' is not accepted." |
| 2:30-3:00 | `eval/run_log.md` audit table and the Boston example (real flags from my runs; the app cannot plant a fake line) | "A separate context reads each line against the profile. It flagged 'Python risk index' because my profile did not say that, and 'progress reviewed' because the profile said 'tracked'. Both were fixed. 5 of 98 lines in drafts without the auditor were flagged; with the loop, 0. It missed one embellishment in my own check, so it is not perfect." |
| 3:00-3:40 | Results table | "Six postings, blind rating, counts only. Requirement coverage by a blind model rater: original 44, naive prompt 48, pipeline 56. Human raters did not separate the pipeline from the naive prompt. I only claim better requirement alignment and traceability." |
| 3:40-4:00 | `eval/limits.md` | "Not proven: any effect on screening or interviews. Two human raters, small sample, one profile, 6 postings. The web app was tested once on a made-up persona and is not part of the evaluation. Next: more users, an API harness, an MCP server." |

## If something breaks live
- Posting link not readable: paste the text.
- A step is slow or errors: say so, switch to the pre-run result.
- Never improvise a claim. If asked about screening, say it was not tested.

## After recording
- [ ] Watch it once with sound. Check that no private data appears.
- [ ] Put the video link in the README and the write-up, then commit.
