# TailorCV: permanent project instructions

Read this file, then START_HERE.md and docs/PROJECT_PLAN.md, at the start of every session. START_HERE.md holds the schedule; the plan's schedule assumed a Thursday start.

## Project
IE MSc Business Analytics and AI applied project, due Sunday 15 Nov 2026 (confirm the exact time; the slide said 23:59 ET). Goal: win the class competition. Rubric: business relevance and clarity, depth of Claude usage (skills, agents, MCP, API), rigor (validation, verification, honest limits), quality of documentation and demo.

## Honesty rules
- Never claim the tool beats ATS screeners or gets interviews. Claim only improved requirement and keyword alignment, traceability, and zero unsupported claims after audit.
- The author writes the pre-registered verdicts (eval/preregistered.md) before any pipeline run. Never write them.
- Never invent experience, results, metrics or interview findings. If something has not been run, say so.

## Format rule for every CV
Every final CV follows `sample/IENYC_CV_Template.docx`, as specified in `docs/CV_FORMAT.md`. Fill a copy of the template; do not invent another layout. Any change to the format spec updates that file in the same commit.

## Company-specific text
Profile text that names one company lives in `employer_scoped` and may appear only in a CV for that company. Before delivering any CV, check the full text for company names outside the profile's employers and schools and the posting's company.

## Planned app
The Vercel web app is specified in `docs/APP_SPEC.md`. Not built yet; it comes only after pre-registration is committed. It must reuse the same prompts and auditor as the skill. It may never claim to test whether a CV passes a company's screening.

## Data and git
- Real personal data stays in `private/` (git-ignored): `private/profile.yaml`, the real CV, ratings that identify people. Never commit it, never paste it into committed files, never send it to external services.
- Everything else (code, prompts, docs, eval files, the template, synthetic samples) is committed. Every change goes into git with a clear message. Commit pre-registration separately and before any pipeline run; never edit it afterwards.
- Log any prompt change made after seeing results in `eval/bug_log.md`.

## If behind schedule, cut in this order
MCP server, plugin packaging, ablation without gap questions, fewer interviews. Never cut pre-registration, the A/B baselines, the auditor, or the limits section.

## Working style
Short replies. One clear next step at a time.
