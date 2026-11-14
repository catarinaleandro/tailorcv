---
name: professional-summary
description: Writes the 2-3 line Professional Summary of a tailored CV from a profile and a job posting's requirements, using only supported facts. Use whenever tailorcv builds a CV, or when the user asks to write, rewrite or improve a CV summary or profile statement.
---

# Professional Summary writer

The summary is the first thing a recruiter reads and the densest place for posting keywords. It must be specific, true, and written for this posting only.

## Inputs
- `profile.yaml` (entries with IDs), the job-analyst requirements (must-haves, keywords), the posting's company name and country.
- Years of experience: run the computation below. Never estimate it.

## Hard rules
1. 2 to 3 lines when printed (about 300 characters or fewer). One paragraph, no bullets.
2. No first-person pronouns (I, my, me). Start with the identity, not "I am".
3. Every claim traces to a profile entry ID. Return the IDs with the text. No new skills, numbers, titles or employers.
4. Include years of experience as computed. Count only the `experience` section (paid work, internships, self-employment), merge overlapping date ranges, count to today for "present". Under 12 months: say the months ("8 months"). Do not count education, projects, leadership or achievements. Round down; use "3+ years" style, not decimals. Graduate profiles will often total months to 1-2 years; that is fine and must be stated honestly.
5. Name what the candidate brings to this role using the posting's own keywords, but only keywords the profile supports. A requirement that is a GAP never appears.
6. Company names: the only company names allowed are employers and schools that appear in the profile's `experience`, `education`, `leadership` entries, and the posting's company. Text in `employer_scoped` (written for one specific company) may be used only when its `company` equals the posting's company. Anything else naming a company is dropped. Run the company-leak check below before returning.
7. Spelling follows the job's country: US spelling for US postings (analyzed, organize, color), British for UK/EU postings unless the posting is written in American English.
8. Banned filler: passionate, hard-working, results-driven, dynamic, motivated, team player, detail-oriented, seeking, "proven track record", "looking to leverage".

## Formula
[Identity and level] + [years computed + strongest quantified proof relevant to the posting] + [what this brings to the role, in posting keywords].

Write 3 candidates that lead with different proof points. Score each 0-2 on: specificity (a number or named outcome), relevance (uses top must-have keywords), voice (no filler, no pronouns, active), length (fits 3 lines). Return the highest score, with its entry IDs. If two tie, prefer the one whose proof point is quantified.

## Example (synthetic persona, not a real person)
Posting: Product Analyst, US fintech. Profile: product analytics intern, Tableau dashboard used by 3 teams, SQL funnel analysis, MSc in progress.
- Weak: "Hard-working student passionate about data seeking an analyst role."
- Strong: "Business analytics graduate student with 4 months of product analytics experience. Built a Tableau churn dashboard used by 3 product teams and used SQL funnel analysis to locate an onboarding drop-off, bringing the SQL, experimentation-minded prioritization and stakeholder communication this role asks for."
(Only valid if "experimentation-minded prioritization" and "stakeholder communication" are supported by entries; otherwise remove them.)

## Company-leak check (deterministic, run after writing)
1. Build the allowed set: org names from profile `experience`, `education`, `leadership`, plus the posting's company.
2. Build the forbidden set: every `employer_scoped[].company` whose company differs from the posting's company.
3. If any forbidden name appears in the summary (case-insensitive), rewrite without it and re-check. The same check runs on the whole CV text before delivery.
