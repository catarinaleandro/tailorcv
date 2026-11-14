# CV format (permanent rule)

Every final CV deliverable (conditions A to D, demo, held-out, write-up examples) follows the IE New York College CV template: `sample/IENYC_CV_Template.docx`. No exceptions, no alternative layouts. Fill a copy of the template; never rebuild the layout from scratch. Delete the template's review comments from the output.

Extracted from the template (inspected 14 Nov 2026):

## Page and type
- US Letter, 0.5 in margins on all sides, one page by default (two only if the content truly needs it).
- Calibri throughout. Body 11 pt. Name 18 pt in small caps. Single line spacing, 0 pt space after paragraphs.
- No tables, text boxes, columns, images or icons in the body (ATS-safe; see `references/ats-rules.md`).

## Section order
1. Name (18 pt, small caps), then one contact line: email | phone | LinkedIn | City, ST
2. Professional Summary (optional)
3. Education
4. Professional Experience
5. Skills
6. Additional Experience (leadership, projects, achievements)

Section headings: bold, with a single bottom border (colour 1F497D, 1 pt) under the heading.

## Entry layout
- Line 1: ORG in small caps, then ` | ` and a short descriptor of the organisation. Location right-aligned on the same line using a right tab at 10742 twips.
- Line 2: role or degree in italics. Dates right-aligned on the same line, format `Mon. YYYY – Mon. YYYY` or `Mon. YYYY – Present`.
- Bullets: the template's bullet list style, one line each where possible, past tense for finished roles, present tense for current ones.
- One blank line between entries.

## Content rules (from the template's own comments)
- Contact: professional email (first and last name), US phone number for US applications, personalised LinkedIn URL, `City, ST` only for US roles (no "USA" or other countries). For non-US roles use `City, Country`.
- Summary: written by `skills/professional-summary`. 2 to 3 lines, no first-person pronouns, years of experience computed from the profile's `experience` dates (months if under a year), what the candidate brings to the specific role in the posting's keywords. Text written for one named company is used only for that company.
- Bullets: quantify where the profile has a number, focus on impact over description. Never add a number the profile does not contain.
- Skills: add the posting's keywords here only when the profile supports them. Languages line first, then Technical.
- Education: degree in italics, with GPA, honors and scholarships as bullets only if they are in the profile.

## Conflicts and how they are resolved
- The template's sample shows `NEW YORK, USA` while its own comment says to drop the country for US roles. The comment wins: `New York, NY`.
- The profile uses `YYYY-MM` dates; the CV prints `Mon. YYYY`.
- If a profile entry lacks a location, date or title, the CV omits that item rather than inventing it, and the report lists the omission.
- Remote roles show `Remote` in the location slot.
- Spelling follows the job's country: US spelling for US postings.
- The final CV text is scanned for company names that do not belong (employers and schools in the profile, plus the posting's company, are the only allowed names); any other name, such as a different employer a summary line was written for, blocks delivery.

## Checks before delivery
- `template_check.py` (to be written once outputs exist) confirms font, margins, section order, border colour, no tables, and no leftover template text such as "James Smith" or review comments.
- The fabrication auditor still runs on the CV text; format compliance does not replace it.
