# Submission: TailorCV

**Project:** TailorCV, a tailored one-page CV builder with a fabrication audit. IE MSc Business Analytics and AI, applied project, due Sunday 15 November 2026, 23:59 ET.

**What it is.** TailorCV builds a CV in the IE New York College template from a structured profile and a job posting. It matches each requirement to real evidence, asks questions about gaps, gives an Apply / Stretch / Skip verdict, and audits every line with a separate agent. It does not claim to beat ATS screeners or to get interviews.

## Links
- Repository: https://github.com/catarinaleandro/tailorcv
- Live web app: https://tailorcv-seven-ruby.vercel.app (access code sent to reviewers separately, not in the repository)
- Demo video: [PASTE VIDEO LINK]
- Write-up (2 to 3 pages): [PASTE WRITE-UP LINK OR ATTACH PDF]

## Where to look for the thinking behind it
- `docs/PROJECT_PLAN.md`: problem, pipeline and evaluation design
- `eval/preregistered.md` and `eval/preregistered_addendum.md`: verdicts written before any run (locked)
- `eval/run_log.md`: what was run, in order, with times
- `eval/bug_log.md`: every problem found and what was changed
- `eval/results_scripted.md`: all results, including the ones that did not favour the tool
- `eval/limits.md`: what the evaluation cannot show
- `eval/interviews.md`: three interviews
- Git history: every step is a commit

## Results in one line
Must-have coverage (blind model rater, six postings): original CV 44.3%, naive prompt 48.3%, TailorCV 56.4%. Human raters did not separate TailorCV from the naive prompt. 5 of 98 lines flagged without the auditor, 0 after the audit loop.

## Short message to paste in the submission form
> TailorCV builds a tailored one-page CV in a fixed template from facts the applicant confirms, and audits every line against a structured profile. On six postings it raised must-have coverage over my original CV (44.3% to 56.4%) with no unsupported claims after audit; human raters did not prefer it over a naive prompt, and I did not test any real ATS. Repository: https://github.com/catarinaleandro/tailorcv. Live app: https://tailorcv-seven-ruby.vercel.app (access code sent separately). Demo video and write-up are attached.
