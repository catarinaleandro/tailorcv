# TailorCV web app (MVP)

Next.js on Vercel plus one Python function (`api/cv_docx.py`) that fills a copy of the IE New York College template with the same renderer as the evaluation pipeline.

Not part of the evaluation. The prompts in `lib/prompts.js` and the files `api/_build_cv.py`, `api/_template_check.py` and `api/IENYC_CV_Template.docx` are generated from the repo root by `python3 scripts/sync_app_prompts.py`; do not edit them here.

## Environment variables (set in Vercel, never in the repo)
- `ANTHROPIC_API_KEY`: the owner's key.
- `APP_ACCESS_CODE`: any long random string; users type it in the app.
- `ANTHROPIC_MODEL` (optional, default `claude-sonnet-5-5`).

## Run locally
`npm install && npm test && npm run dev` (the Word file step needs Vercel's Python runtime or `vercel dev`).

## What it does not do
It does not test whether a company's screening accepts a CV, and it does not store profiles on a server (they live in the user's browser).
