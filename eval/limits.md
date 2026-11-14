# Limits log

Add each limitation as you notice it. Starting list:
- Small test set (6 + 2 postings), one author, one profile.
- Real ATS behavior is opaque; keyword match is a proxy, not proof.
- The LLM auditor can miss subtle embellishment; checked manually on 3 CVs only.
- No claim about interview or job outcomes.
- Job sites often block automated fetching, so postings are saved as text.

- Pre-registration provenance: the committed verdicts for postings 03 to 06 were entered before the author stated them in chat (author's own statement came 3 minutes later and matched). See eval/preregistered_addendum.md.

## Added 14 Nov 2026 (from the runs)
- One author, one profile, six evaluation postings plus two held-out. Counts and rates only; no significance claims.
- Held-out postings were not blind: the author read them before answering gap questions, and the assistant skimmed one during extraction. They were run once with no prompt change.
- The auditor is one model checking another model's output. It missed two embellishments in draft CVs that its second and third rounds then caught after rewrite. Zero flags is not proof of zero fabrication. Human line-by-line checks cover 4 of 8 final CVs (C_02, C_04, C_05, H_08), each as one blanket "all true" from the author.
- Rewrites after audit flags and page-length trims were made by the orchestrator (the assistant), not the builder, so C is a pipeline plus orchestrator edits.
- Matcher variance: one requirement flipped status between two runs on posting 02; the job analyst once split a degree alternative into a separate hard must-have (posting 02). Not fixed; verdict unaffected.
- Coverage is judged by model raters of the same family as the builder, one rater per posting. C and D benefit from gap answers that A and B could not use.
- Keyword match counts every frozen keyword, including ones the profile cannot honestly support, so absolute percentages are low. C is below B on keyword match on 3 of 6 postings (03, 05, 06) because the builder does not claim unsupported terms.
- The builder over-applied the company-name rule on held-out runs (dropped a climate-finance initiative and a project naming a wearable brand). The professional-summary skill pulls toward fit phrasing that the auditor then trims.
- B-condition deviations (agent read files rather than pasted text; told not to read other files) and orchestrator usage errors are logged in run_log.md and bug_log.md.
- Pre-registered verdicts: 4 of 6 agreed with the pipeline; the held-out verdicts were not pre-registered.
- The Vercel app, MCP server and plugin packaging are specified or planned only and not built, so no claim is made about them.
- Profile facts the author later corrected (Group Project S dates and team size) were not in the CVs as evaluated.
- Nothing here shows the CVs pass a real ATS or lead to interviews. Not measured.
- Human raters: two raters, six postings. The author states both rated on their own, without AI tools (author's statement, 14 Nov 2026, 18:33 ET; not independently verified). Raters could guess condition from style (A and B plain text, C and D template). Ratings show no preference for the pipeline over the naive prompt (pooled mean 2.50 vs 2.42).
