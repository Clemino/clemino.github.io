#!/usr/bin/env bash
# Usage: pnpm publish:course <id> [site-folder]
# Builds one course and copies it into site/<id>/ of this repository. Nothing is pushed.
set -euo pipefail

course="$1"
site="${2:-../site}"

COURSE="$course" pnpm build
# Segment prefetch files are 84% of a build, and navigation works without them.
find out -type f -name '__next.*' -delete
rsync -a --delete out/ "$site/$course/"
echo "$course: $(find "$site/$course" -type f | wc -l) files, $(du -sh "$site/$course" | cut -f1)"
