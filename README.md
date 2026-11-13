# TailorCV

Builds a tailored, ATS-safe Word CV from a structured career profile and a job posting. It asks gap questions, gives an Apply / Stretch / Skip verdict, and has an independent subagent audit every bullet against your profile. Nothing is added that your profile does not support.

Built for the IE MSc Business Analytics and AI applied project.

## Deadline
Sunday 15 November 2026 (confirm exact time with the course).

## Docs
- `START_HERE.md`: exact next steps
- `docs/PROJECT_PLAN.md`: problem, pipeline, evaluation design
- `docs/WRITEUP_TEMPLATE.md`, `docs/DEMO_SCRIPT.md`, `docs/INTERVIEW_KIT.md`
- `eval/`: pre-registration, bug log, interview notes, limits log

## Status
Scaffold stage. Done: orchestrator skill, 4 reference files, 3 subagents, sample persona, pre-registration template. Not yet built: MCP server, scripts, evaluation, plugin.

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
