# Demo runbook: exactly what to do, paste and say

Everything here is the made-up persona Alex Rivera and a fictional company. Nothing real. Target 4:00, limit 5:00. Do one practice run first.

## 0. Setup (before recording)
1. Close tabs that show real data (Gmail, `private/`, rater sheets, Vercel env page). Hide bookmarks.
2. Open these tabs in order: (1) original vs tailored CV sample images or .docx, (2) the GitHub repo README, (3) `sample/profile.yaml` on GitHub, (4) the app https://tailorcv-seven-ruby.vercel.app, (5) `eval/results_scripted.md`, (6) `eval/run_log.md`, (7) `eval/limits.md`.
3. In the app, type the access code yourself and make sure it is not visible in the recording (record after typing it, or crop it).
4. Run the whole flow once beforehand. Then click **Delete my data** so the recording starts clean. Keep a finished .docx open in another window as backup.

## 1. 0:00 to 0:30, the problem (face camera or tab 1)
Say: "Tailoring a CV for every posting is slow. Generic CVs miss what the posting asks for. And AI tools tend to invent experience. TailorCV tailors from facts I confirm and checks every line against them."

## 2. 0:30 to 1:00, how it works (tab 3, then README)
Say: "I enter my facts once, and every line has an ID and a source. A job analyst extracts the requirements, an evidence matcher marks each one supported, partial or a gap, I answer a few questions about gaps, a builder writes the CV into my school's template, and a separate auditor, which never saw how the CV was written, checks every line."

## 3. 1:00 to 2:30, live app (tab 4)
**Access code:** type yours. Don't show it.

**Profile boxes. Paste exactly:**
- Full name: `Alex Rivera`
- Email: `alex.rivera@example.com`
- Phone: `+1 555 0100`
- LinkedIn URL: `www.linkedin.com/in/alex-rivera-demo`
- City and state: `Boston, MA`
- Education:
```
MSc in Data Analytics, Northeast Demo University, September 2025 to June 2026 (expected). GPA 3.8/4.0.
BSc Economics, Lakeside College, September 2021 to June 2025.
```
- Work experience:
```
Data Analyst Intern, Brightside Retail (Boston), June 2025 to August 2025. Built a Tableau dashboard of weekly sales used by 3 regional managers. Wrote SQL queries to find the 10 slowest-selling product lines.
Founder, Rivera Tutoring (self-employed), January 2023 to present. Tutor 12 students in statistics and Excel; scheduled sessions and tracked payments in a spreadsheet.
```
- Skills: `SQL, Python (pandas), Tableau, Excel, statistics. Languages: English (native), Spanish (fluent).`
- Extra:
```
Project: Bike-share demand forecast, October 2025. Used Python and a simple regression on public ride data; found weekday temperature explained most of the variation.
Treasurer, Data Science Club, September 2024 to May 2025.
```
Click **Structure my profile** (about 6 s). Say: "The model only structures what I wrote. I can edit it before saving." Click **Save profile**.

**Job. Paste into "Or paste the posting text"** (leave the link empty; many job sites cannot be read):
```
Business Analyst, Northwind Analytics (fictional company for testing). Location: Boston, Massachusetts, United States.
About the role: Northwind Analytics helps retailers understand their customers. As a Business Analyst you will analyze sales data, build dashboards and present findings to account managers.
Requirements: Bachelor's degree in economics, statistics, business or a related field. Experience writing SQL queries to analyze data. Experience building dashboards in Tableau or Power BI. Strong written and verbal communication skills, including presenting findings to non-technical stakeholders. Ability to work with stakeholders across teams. Eligibility to work in the United States.
Preferred: Experience with A/B testing. Knowledge of Python for data analysis. Familiarity with retail or e-commerce data.
What we offer: hybrid work model, mentorship, and a collaborative team. We are an equal opportunity employer. Apply with your CV. This is a full-time, entry-level position reporting to the Head of Analytics. You will work with a small team of analysts and data engineers and partner with customer success and sales. Responsibilities include cleaning data, running analyses, and writing short summaries of insights for clients each week.
```
Click **Analyse the job**. Say: "Each requirement is matched to my evidence as supported, partial or gap."

**Gap questions.** The wording is generated, so read each question and pick the matching answer. Answers are for the made-up persona only:
- Work eligibility in the US: `Yes, I am authorized to work in the United States.`
- Presenting to non-technical people: `I presented my dashboard results to the three regional managers in a weekly meeting.`
- A/B testing, or anything else you have no evidence for: tick the **none** checkbox.
Click **Save answers and re-check**. Say: "I can only answer with facts. Saying 'I have everything' would not be recorded." Show the **Verdict** and the "what could close the gap" list.

Click **Build my CV** (about 15 s plus the audit). Show the audit rounds, the readiness report, then **Download CV (.docx)** and open it. Point to: template layout, one page, every line from the profile. If it is slow, say "this is a pre-run result" and use the backup .docx.

## 4. 2:30 to 3:00, auditor evidence (tab 6, `eval/run_log.md`)
Say: "The app can't plant a fake line, so here are real flags from my runs. The auditor flagged 'Python risk index' because my profile never said that, and 'progress reviewed' because the profile said 'tracked'. Both were fixed. In drafts without the auditor, 5 of 98 lines were flagged; with the loop, 0. It also missed one embellishment in my own manual check, so it is not perfect."

## 5. 3:00 to 3:40, results (tab 5, `eval/results_scripted.md`)
Say: "Six postings, counts only, no significance tests. Requirement coverage by a blind model rater: original CV 44, naive one-shot prompt 48, pipeline 56. Two human raters did not separate the pipeline from the naive prompt. Fabricated lines: 5 of 98 without the auditor, 0 with. I only claim better requirement alignment and traceability, not that it beats ATS screeners or gets interviews."

## 6. 3:40 to 4:00, limits (tab 7, `eval/limits.md`)
Say: "Not proven: any effect on screening or interviews. Two human raters, one profile, six postings, and a model rater from the same family as the builder. The web app was tested once on a made-up persona and is not part of the evaluation. Not built: an MCP server, plugin packaging, and an API evaluation harness."

## If something goes wrong
- Link not readable: paste the text (this is expected, say so).
- A step errors or is slow: say it, then use the backup .docx and say it is pre-run.
- Asked about screening: "I did not test that."

## After recording
1. Watch it once with sound. Check no real name, email, access code, or Vercel page appears.
2. Click **Delete my data** in the app.
3. Upload the video, put the link in README and write-up, tell me and I will commit it.
