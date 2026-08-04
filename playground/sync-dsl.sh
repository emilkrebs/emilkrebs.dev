#!/usr/bin/env bash
# Vendors the Healthstack DSL into the playground.
#
# The language SERVER is bundled into a single minified artifact
# (src/lang/vendor/biohacking-language.min.mjs) — the readable implementation
# never enters this repo. The sample protocols are copied as-is, filtered to
# the curated supplements-only set.
#
# Usage:
#   BIOHACKING_IDE=/path/to/biohacking-ide ./sync-dsl.sh
#
# Excluded: compiler/ (DSL->SQLite compiler, node-only better-sqlite3);
# the full std library and non-curated samples stay in the IDE repo.
set -euo pipefail

BIOHACKING_IDE="${BIOHACKING_IDE:-}"
if [ -z "$BIOHACKING_IDE" ]; then
  echo "error: BIOHACKING_IDE is not set" >&2
  echo "usage: BIOHACKING_IDE=/path/to/biohacking-ide $0" >&2
  exit 1
fi

DSL_SRC="$BIOHACKING_IDE/extensions/biohacking-dsl/packages/language"
SAMPLES_SRC="$BIOHACKING_IDE/samples"
HERE="$(cd "$(dirname "$0")" && pwd)"

if [ ! -d "$DSL_SRC/src" ]; then
  echo "error: DSL package not found at $DSL_SRC" >&2
  exit 1
fi
if [ ! -d "$SAMPLES_SRC" ]; then
  echo "error: samples not found at $SAMPLES_SRC" >&2
  exit 1
fi

mkdir -p "$HERE/src/lang" "$HERE/src/samples"

echo "bundling language server (minified artifact)…"
node "$HERE/scripts/build-lang-bundle.mjs"

# Only the curated, supplements-only samples ship with the public site.
# The full sample set (peptides, prescription-pharmacology demos) stays in
# the IDE repo — see curated/ and scripts/generate-curated-bundles.mjs.
rsync -a --delete \
  --exclude 'healing-peptide-stack.bio' \
  --exclude 'glow-protocol.bio' \
  --exclude 'drug-interaction-example.bio' \
  --exclude 'interactions.bio' \
  --exclude 'substances.bio' \
  --exclude 'hormone-panel-baseline*' \
  --exclude 'empty.protocol' \
  "$SAMPLES_SRC/" "$HERE/src/samples/"

echo "rebuilding curated bundled library..."
node "$HERE/scripts/generate-curated-bundles.mjs"

echo "synced:"
echo "  $(ls "$HERE/src/lang/vendor" | wc -l | tr -d ' ') vendor artifact in src/lang/vendor"
echo "  $(ls "$HERE/src/samples" | wc -l | tr -d ' ') samples in src/samples"
echo "warning: src/lang/vendor is generated output - do not edit by hand"
