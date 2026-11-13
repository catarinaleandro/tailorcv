---
name: tailorcv
description: Builds a tailored, ATS-safe Word CV from a structured career profile for a specific job posting, with gap questions, an Apply/Stretch/Skip verdict, and an independent fabrication audit. Use this skill whenever the user shares a job posting or URL and wants a CV tailored to it, asks whether they should apply to a role, wants to check their fit for a job, or says things like "tailor my CV", "build a CV for this job", "what am I missing for this role", or "does my CV match this posting", even if they never say "skill" or "ATS".
---

# TailorCV

Turn a structured profile (profile.yaml) plus a job posting into a tailored .docx CV.
Core rule: **nothing goes in the CV that is not traceable to a profile entry ID.**

## Inputs
- `profile.yaml` (every entry has an `id`). Default path: `private/profile.yaml`; for demos use `sample/profile.yaml`.
- The job posting: pasted text, a saved .txt, or a URL (use the `fetch_posting` MCP tool if available; otherwise ask the user to paste the text).
- The user's Word template (.docx). If missing, ask for it. Do not invent a layout.

## Workflow (run in order, do not skip steps)

1. **Analyze the posting.** Delegate to the `job-analyst` subagent. Output: requirements with IDs (r1, r2, ...), tagged must_have or nice_to_have, plus keywords.
2. **Match evidence.** Delegate to the `evidence-matcher` subagent with the requirements and profile.yaml. Output per requirement: SUPPORTED, PARTIAL or GAP, with profile entry IDs.
3. **Ask gap questions.** Read `references/gap-questions.md`, then ask at most 5 questions, ranked by importance. Allow "I don't have this" as a valid answer. Append every real answer to profile.yaml as a new entry with `source: user-confirmed`. Re-run step 2 on affected requirements.
4. **Give the verdict.** Read `references/fit-rubric.md`. State Apply, Stretch or Skip with reasons and the list of confirmed gaps. If Skip, say so plainly and ask whether the user still wants a CV.
5. **Build the CV.** Read `references/ats-rules.md`. Use the docx skill to fill the user's template. Select and reorder profile entries by relevance. Reword only within what the entry supports. Write a sidecar `<output>.sources.json` mapping each CV bullet to its source entry IDs.
6. **Audit.** Delegate to the `fabrication-auditor` subagent. Give it ONLY the final CV text and profile.yaml, never the reasoning, requirements or earlier drafts. Rewrite every OVERSTATED or UNSUPPORTED bullet (or delete it), then audit again. Stop when there are zero flags or after 3 rounds; report any remaining flags to the user.
7. **Report.** Show: verdict, coverage summary (must-haves supported / total), questions asked, audit result, and the output path.

## Hard rules
- Never add a skill, tool, metric, title, date or employer that is not in profile.yaml.
- Never inflate numbers or scope ("led" for "contributed to", "team of 10" for "team").
- Never claim the CV will pass ATS screening. Say it follows ATS-safe formatting and aligns keywords with the posting.
- If the user says they lack a requirement, it stays a gap and is left out of the CV.

## Examples that should trigger this skill
- "Tailor my CV for this job: https://example.com/jobs/product-manager"
- "Should I apply to this PM role? Here's the posting."
- "I found a posting, build me a CV for it."
- "What am I missing for this job based on my profile?"
- "Does my profile match this role?"

## Examples that should NOT trigger it
- "Write me a cover letter for this job." (different task)
- "Fix the grammar in this paragraph."
- "Give me interview questions for a PM role."

## Files
- `agents/` : job-analyst, evidence-matcher, fabrication-auditor (copy to `.claude/agents/` in Claude Code)
- `references/` : fit-rubric, ats-rules, gap-questions, no-fabrication-policy (read only when the step needs them)
