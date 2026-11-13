#!/usr/bin/env bash
# One-command GitHub setup. Run from the project root: bash scripts/setup_github.sh
# Needs the GitHub CLI (https://cli.github.com). If you don't have it, follow the manual steps in START_HERE.md.
set -e
if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) not found. Install it from https://cli.github.com or use the manual steps in START_HERE.md."
  exit 1
fi
if ! gh auth status >/dev/null 2>&1; then
  echo "Not logged in. Running: gh auth login"
  gh auth login
fi
[ -d .git ] || git init
git add -A
git commit -m "Scaffold" || echo "Nothing new to commit."
git branch -M main
gh repo create tailorcv --private --source=. --remote=origin --push
echo "Done. Check that private/ contains only .gitkeep on GitHub."
