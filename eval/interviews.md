# Interview notes

Collected Sat 14 Nov 2026 (received 18:35 ET). Three people recruited by the author, anonymous, notes pasted by the author as written to her by the interviewees. Not verified. Interview 3 first arrived incomplete (cut off mid-sentence in answer 4, no answer 5); the full answers 4 and 5 were pasted by the author at 18:36 ET and are recorded below. The design of TailorCV existed before these interviews, so the findings below are recorded as support or tension for existing choices, not as things that drove them.

Questions: see docs/INTERVIEW_KIT.md.

## Interview 1 (graduate business analyst application)
1. Applied for a graduate business analyst role. Highlighted the skills in the job description, picked university projects and internship examples that matched, rewrote the summary, reordered bullets and adjusted formatting. About an hour and a half.
2. Slowest part: deciding which experiences count. Something relevant was done but the job description uses different language. Also spends too long fitting everything on one page.
3. Used ChatGPT with the CV and job description. It made an internship sound like managing the whole project. Wording sounded impressive but would be hard to defend in an interview.
4. Would never let AI write results or responsibilities not provided. It can help explain experience but cannot decide that revenue increased or a team was led.
5. Would trust specific questions such as "What part of this project did you personally own?". Would skip it if it asked to retype the whole CV or answer twenty questions before showing anything useful.

## Interview 2 (moving from hospitality operations into customer success)
1. Reviewed the role, picked examples about customer problems, training and process improvements, rewrote them so someone outside hospitality could see the relevance. Two or three hours.
2. Slowest part: explaining transferable skills without pretending to have already done the new job; does not want to replace actual experience with software-industry terminology.
3. Used an AI tool. It turned guests into "enterprise accounts" and described the booking system as a CRM platform. It removed the operational details that made the examples convincing. Sounded more relevant at first but less accurate.
4. Would never let AI write the reason for changing careers without asking first; it tends to invent a lifelong passion for technology. The real reason is more practical: enjoys solving customer problems and wants to build on that experience.
5. Would trust it if it asked about real situations and showed how the answers supported each bullet. Would skip it if it promised a perfect match or hid gaps that still needed addressing.

## Interview 3 (senior product role application)
1. Started with the existing CV, checked the role's scope, selected examples showing relevant decisions, business results and leadership. Cut older experience and checked every claim. Around forty-five minutes.
2. Slowest part: choosing what to leave out. A CV can become a list of everything done. Checking that particular metrics can be disclosed also takes time.
3. Has used AI to shorten bullets and suggest alternative structures. It often replaces precise language with generic claims like "drove strategic transformation" and blurs the line between what was owned and what the team delivered.
4. Would never let AI write confidential information, invented metrics or claims about personal contribution. Would also review any statement about strategy carefully because the decision and trade-offs behind it need to be explainable.
5. Would trust a short, optional set of questions focused on missing evidence, with a clear explanation of how the information is stored, and would want to see exactly what changed. Would skip a generic questionnaire that ignored the CV already uploaded.

## Findings tied to design decisions
Counts are out of 3 interviews.

| Finding | How many said it | Existing design choice it supports |
|---|---|---|
| Tailoring is manual and takes 45 minutes to 3 hours (90 min, 2-3 h, 45 min) | 3 of 3 | The problem the tool targets |
| Hardest part is deciding what counts or what to leave out | 2 of 3 (1 and 3); interview 2 raised transferable-skill wording | Evidence matching with SUPPORTED / PARTIAL / GAP |
| AI tools exaggerated ownership, scope or titles, or used generic or inflated terms | 3 of 3 | Fabrication auditor; no-fabrication policy |
| Would never let AI invent results, metrics or personal contribution | 2 of 3 (1 and 3); interview 2 named invented personal motivation instead | Every line cites profile IDs; nothing added that the profile lacks |
| Would trust specific, evidence-focused questions about real situations | 3 of 3 (1: what they personally owned; 2: real situations with each bullet traced; 3: short optional questions on missing evidence) | Gap questions that ask for evidence, with traceable bullets |
| Would skip a tool that promises a perfect match or hides gaps | 1 of 3 (2) | Honest verdict and gap list; no promise of screening results |
| Would skip a tool that asks for a full retype, many generic questions, or ignores the uploaded CV | 2 of 3 (1 and 3) | Maximum 5 gap questions, profile saved once |
| Wants a short or optional question set, to see exactly what changed, and to know how data is stored | 1 of 3 (3) | Audit trail of cited IDs; data-handling section of the app spec (not built) |
| Wants the CV to fit one page | 1 of 3 (1) | One-page template check |

## Limits of these interviews
- Three people, found by the author, anonymous, and the notes were relayed by the author.
- Only interview 1 is a graduate applicant. Interview 2 is a career changer and interview 3 is a senior candidate, so two of three are outside the graduate target group.
- No interviewee used TailorCV; none of this measures whether the tool helps them.
