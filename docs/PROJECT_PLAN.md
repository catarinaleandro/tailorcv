# Project plan

**Deadline: Sunday 15 November 2026 (confirm the exact time; the course slide said 23:59 ET). Target submission: Sunday 17:00.**

## What this is
TailorCV turns a structured career profile into a tailored, ATS-safe Word CV for a given job posting. It compares the posting with the profile, asks targeted gap questions, gives an Apply / Stretch / Skip verdict, builds the CV in the user's template, and has an independent subagent audit every bullet against the profile.

## Problem and user
- **User:** a job seeker applying to many roles (here: product manager roles at tech firms).
- **Job to be done:** get a trustworthy tailored CV quickly, and know whether a role is worth applying to.
- **Pain:** tailoring takes 30 to 60 minutes per application; AI tools tend to invent experience.
- **North-star metric:** time to a trustworthy tailored CV. **Inputs:** requirement coverage, keyword match, unsupported claims, edit distance from the user's final version.

## Claims (and non-claims)
Claims: cuts tailoring time; raises requirement and keyword coverage versus the original CV and a one-shot prompt; zero unsupported claims after audit; verdicts agree with the author's pre-registered judgment.
Non-claims: beating ATS screeners, getting interviews, a "perfect" CV. Real ATS behavior is opaque and referrals often matter more.

## Pipeline
1. job-analyst: posting to requirements (must-have / nice-to-have) and keywords
2. evidence-matcher: requirements to profile entry IDs (SUPPORTED / PARTIAL / GAP)
3. gap questions (max 5), answers saved as user-confirmed entries
4. fit verdict (thresholds in references/fit-rubric.md)
5. cv-builder fills the Word template, writes a bullet-to-source sidecar
6. fabrication-auditor sees only the CV and the profile, labels each bullet SUPPORTED / OVERSTATED / UNSUPPORTED

## Evaluation
Postings: 6 evaluation + 2 held-out (strong, medium, poor, adversarial mix).

| Condition | Description |
|---|---|
| A | Original CV, unchanged |
| B | Naive one-shot prompt |
| C | Full pipeline |
| D | Pipeline without the auditor |

| Metric | How |
|---|---|
| Must-have coverage | Against frozen requirement lists |
| Keyword match | Deterministic script |
| Unsupported claims | Auditor + manual check of every bullet in 3 CVs |
| Verdict agreement | Pipeline vs. pre-registered verdicts |
| Human preference | 2 blind raters, 1-5 scores and ranking |
| Cost and latency | Logged per run |

Protections: verdicts pre-registered and committed before any run; requirement lists frozen before scoring; held-out postings run once; any prompt change after seeing results is logged; with this sample size report counts and rates, not significance tests.

## Course modules used
01 Claude 101 (planning, drafting) | 02 Analyzing Data (results notebook) | 04-05 Claude Code and Agent Skills (orchestrator, references) | 06 Subagents (analyst, matcher, auditor) | 07-08 Claude Code in Action / Software Development (scripts, repo) | 09 API (evaluation harness, optional) | 03 Plugins and 10 MCP (stretch, only if time allows)

## Cuts (lost a day) and never-cuts
Cut: MCP server, plugin packaging unless ahead, ablation without gap questions, interviews 3 instead of 5.
Never cut: pre-registration, A/B baselines, fabrication auditor, limits section.
