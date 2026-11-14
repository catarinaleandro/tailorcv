# TailorCV web app (Vercel): spec

Status: MVP built in `app/` on 14 Nov 2026 (after pre-registration and the core evaluation). It is a front end over the same prompts, subagent roles, auditor, renderer and template checker as the skill: `scripts/sync_app_prompts.py` copies them into `app/`, and `--check` fails if they drift. The app was NOT part of the evaluation: none of the results in `eval/` describe it.

Differences from this spec, as built:
- The profile is saved in the user's browser only (localStorage), with export and delete buttons. There is no server storage, no accounts and no keying by email; this avoids storing personal data but means the profile does not follow the user to another browser.
- Access is gated by an access code (`APP_ACCESS_CODE`) the owner sets in Vercel, so the owner's API credits are not open to strangers. `ANTHROPIC_API_KEY` is also set by the owner in Vercel and never appears in code or chat.
- Gap-question answers are saved word for word as `user_confirmed` evidence entries, not as restructured bullets.
- Page length is estimated from line counts (the renderer's PDF check needs LibreOffice, which does not run in the app); the estimate was calibrated on 14 CVs of this project.
- Job links are fetched server-side; many sites block that, so pasting the text is the fallback.
- Not built: multi-user storage, history of past runs.

## User flow
1. **Profile setup (once).** Fields: name, email, LinkedIn URL, city and state, phone. Four free-text boxes with no required format: Education, Work experience, Skills, Extra (leadership, projects, achievements, languages). Claude parses each into structured entries with IDs and shows the result for the user to correct before saving. Nothing is saved until the user confirms.
2. **Job link.** The user pastes a posting URL (fallback: pasted text, because many job boards block automated fetching).
3. **Posting analysis.** Requirements (must-have / nice-to-have), keywords, company name and country.
4. **Gap questions.** At most 5, ranked, "I don't have this" is a valid answer. Answers become `user_confirmed` entries and are saved to the profile.
5. **Verdict.** Good fit / Stretch / Poor fit (internal labels Apply / Stretch / Skip, thresholds in `references/fit-rubric.md`), with the evidence behind it.
6. **Close-the-gap plan.** For each confirmed gap, 1 to 3 realistic short-term actions (course, small project, volunteering, tool practice) with an honest effort estimate. Advice only; none of it goes in the CV until the user has actually done it.
7. **CV.** Summary from `skills/professional-summary`, then the CV filled into `sample/IENYC_CV_Template.docx` per `docs/CV_FORMAT.md`, followed by the fabrication audit. Download as .docx.
8. **ATS readiness report** (see below).

## What the "screening test" is, and is not
The app cannot know whether a given company's real screening passes a CV; those systems are opaque and recruiters often decide differently. It reports only what can be checked: (a) the .docx parsed back to text has the sections, dates and contact line in the right order, with no tables or images; (b) must-have coverage and keyword match against the posting; (c) audit result (unsupported claims remaining). Never word it as "passes ATS".

## Safeguards
- Company-leak check on the full CV text before delivery (rule in `skills/professional-summary`). Employer-scoped text such as a line written for one company is stored apart from the summary and used only for that company.
- Fabrication auditor sees only the final CV and the profile.
- Spelling and location format follow the posting's country.

## Data handling
- Real users' data is personal data (GDPR). Store the minimum: profile and saved answers, keyed by a random profile ID plus email, not by name alone (names collide). Provide "delete my data". No analytics on CV text, no logging of CV content, no real data in the repository or in demo recordings; use the synthetic persona for the demo.
- The Anthropic API key is set as a Vercel environment variable by the owner. It is never put in code, chat or the repo.

## Technical outline
Next.js on Vercel; Anthropic API called server-side with the same prompts as `agents/`; structured JSON outputs validated before use; a persistent store for profiles (Vercel storage); .docx generation by filling a copy of the template (Node, e.g. docxtemplater) and removing the template's review comments. Cost and latency logged per run for the write-up.

## Cut order if time runs short
Close-the-gap plan detail, then job-link fetching (paste only), then multi-user storage (single saved profile). Never cut: the auditor, the company-leak check, the limits section.
