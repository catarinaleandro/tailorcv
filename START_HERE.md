# START HERE

**Today is Friday 13 November (evening).** The first version of the plan assumed a Thursday start, so one day is gone. This page replaces the schedule in the plan doc. Tick boxes as you go (GitHub shows them as clickable checkboxes).

Deadline: **Sunday 15 November** (confirm the exact time; the course slide said 23:59 ET). Target: submit by Sunday 17:00.

---

## RIGHT NOW (tonight, about 3 hours)

### 1. Confirm the deadline (5 min)
- [ ] Deadline is the 15th. Check the portal for the exact time and fix the line above if it differs.

### 2. Put the project on GitHub (10 min)
I can't create the repo for you (it needs your GitHub login). Fastest route, if you have the GitHub CLI (`gh`) installed:

```
bash scripts/setup_github.sh
```

That script (untested on my side) creates a private repo called `tailorcv` and pushes everything. If it fails or you don't have `gh`, use the manual steps below.

- [ ] Unzip `tailorcv-scaffold.zip` and open a terminal in the `tailorcv` folder.
- [ ] On github.com click **New repository**. Name: `tailorcv`. Choose **Private**. Do NOT tick README, .gitignore or license. Click Create.
- [ ] Copy the repo URL GitHub shows (it ends in `.git`), then run:

```
git init
git add .
git commit -m "Scaffold"
git branch -M main
git remote add origin PASTE_THE_URL_HERE
git push -u origin main
```

- [ ] Refresh the repo page. Check that the `private/` folder shows no files except `.gitkeep`.
- Keep it Private until Sunday. At submission, make it Public or add your professor as a collaborator.

### 3. Collect 8 job postings (45 min)
- [ ] Find 8 real product manager postings. Copy each one's full text into `eval/postings/` as a `.txt` file named `01_company_role.txt` ... `08_company_role.txt`.
- [ ] Mix: 2 strong fits, 2 medium, 2 poor, 2 adversarial (they demand something you clearly don't have, like a specific credential or 8+ years).
- [ ] Pick the last 2 (07 and 08) as **held-out**. Do not look at them again until Saturday evening.

### 4. Pre-register your verdicts (30 min) - the most important step
- [ ] Open `eval/preregistered.md`. For postings 01 to 06, write your own verdict (Apply / Stretch / Skip), your top 3 expected must-haves, and the gaps you expect.
- [ ] Run:

```
git add eval/
git commit -m "Pre-registered verdicts before any pipeline run"
git push
```

This commit timestamp is your proof that you wrote the verdicts before seeing results. Do not edit the file afterwards.

### 5. Get your profile built (45 min)
- [ ] Send me your CV text in this chat (delete phone number and home address first). I'll turn it into `profile.yaml` with entry IDs.
- [ ] Read every line of it and tell me what's wrong. Save the final version as `private/profile.yaml`.
- [ ] Also send your Word template if you have one.

### 6. Recruit people (10 min)
- [ ] Message 3 people who are job hunting: "Can I ask you 4 questions about how you tailor your CV? 15 minutes, tomorrow."
- [ ] Message 2 people to be blind raters on Sunday morning: "Can you rate 12 CVs for 20 minutes?"

**When these six are done, tonight is finished.** Go to sleep.

---

## SATURDAY (about 8 hours)

- [ ] **Morning:** set up Claude Code with this folder (see README). Run the skill on `sample/profile.yaml` first, then your real profile on postings 01 to 06. Fix what breaks. Keep a bug log in `eval/bug_log.md`.
- [ ] **Baselines:** for each posting, save condition A (your original CV) and condition B (a naive one-shot prompt: "tailor my CV to this job") in `eval/outputs/`.
- [ ] **Pipeline runs:** full pipeline (condition C) and without the auditor (condition D) on postings 01 to 06. Answer gap questions once and save answers in `eval/answers/`.
- [ ] **Interviews:** 3 x 15 minutes. Notes in `eval/interviews.md`.
- [ ] **Scripts:** ask me for `keyword_match.py` and `template_check.py` once your outputs exist.
- [ ] **Evening:** run postings 07 and 08 once (held-out). Send blind rating packets to your 2 raters. Start the analysis notebook.

## SUNDAY (submit by 17:00)

- [ ] 09:00 Collect ratings, finalize numbers, stop changing prompts.
- [ ] 10:00 Write the 2-3 page write-up.
- [ ] 12:30 Test the README from a fresh folder.
- [ ] 13:30 Record the 4-minute demo.
- [ ] 15:00 Remove private data, push to GitHub, check links in an incognito window, submit.

## CUT BECAUSE WE LOST A DAY
- MCP server: skip (use pasted text). Mention it under next steps.
- Cowork plugin packaging: only if Saturday is ahead of schedule.
- Ablation without gap questions (condition E): skip.
- Interviews: 3 instead of 5. Postings: 6 evaluation + 2 held-out.

## NEVER CUT
Pre-registration, the A/B baselines, the fabrication auditor, the limits section.
