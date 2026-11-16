# TailorCV

Builds a tailored, ATS-safe Word CV from a structured career profile and a job posting. It asks gap questions, gives an Apply / Stretch / Skip verdict, and has an independent subagent audit every bullet against your profile. Nothing is added that your profile does not support.

Built for the IE MSc Business Analytics and AI applied project.

## Live web app (Vercel)
- Live app: https://tailorcv-seven-ruby.vercel.app (needs an access code; the code is given to reviewers separately and is not in this repo).
- Claude API use: the app calls the Anthropic Messages API (model `claude-sonnet-5-5`) for each pipeline step, using the same prompts as the skill and agents. The API key and access code are stored as environment variables in Vercel, never in the repo. The evaluation itself did not use the API; it ran the pipeline as subagents in a Claude session.
- Status: MVP, tested once end to end on a made-up persona (`app/TEST_LOG.md`), not part of the evaluation. The profile stays in the user's browser. It does not test whether a CV passes any company's screening.

## Deadline
Sunday 15 November 2026, 23:59 ET.

## Docs
- `START_HERE.md`: exact next steps
- `docs/PROJECT_PLAN.md`: problem, pipeline, evaluation design
- `docs/SUBMISSION.md`: links and short project text
- `docs/WRITEUP_TEMPLATE.md`, `docs/DEMO_SCRIPT.md`, `docs/DEMO_RUNBOOK.md`, `docs/INTERVIEW_KIT.md`
- `eval/`: pre-registration, bug log, interview notes, limits log

## Status
Evaluation run on 14 Nov 2026 (6 postings plus 2 held-out): see `eval/results_scripted.md`, `eval/run_log.md`, `eval/limits.md`. Built: orchestrator skill, professional-summary skill, 4 subagent prompts, reference rules, scripts (template rendering, template check, keyword match, company-name check, rating scoring), CV template spec, and a web app MVP in `app/` (not part of the evaluation; see `app/README.md`). Not built: MCP server, plugin packaging, API evaluation harness. Real profile, CVs and rater files are not in this repo.

## Setup (Claude Code)
1. Put this folder at the root of your Claude Code project.
2. Copy `agents/*.md` into `.claude/agents/`.
3. Copy this folder into `.claude/skills/tailorcv/` (or install it as a skill).
4. Try the sample persona: ask Claude Code to tailor `sample/profile.yaml` to a posting you paste.
5. Put your real profile and CV in `private/` (git-ignored).

## Layout
See SKILL.md for the workflow. `eval/` holds postings, frozen requirements, saved answers and results.

## Honest scope
Improves requirement and keyword alignment and enforces traceability. It does not promise to pass any ATS screener or to get interviews.
