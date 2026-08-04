#!/usr/bin/env bash
# Vendors the Healthstack DSL into the playground.
#
# Copies the browser-safe parts of the biohacking-ide language package into
# playground/src/lang/ and the sample protocols into playground/src/samples/.
# The language package is the source of truth; never edit src/lang by hand.
#
# Usage:
#   BIOHACKING_IDE=/path/to/biohacking-ide ./sync-dsl.sh
#
# Excluded: compiler/ (DSL->SQLite compiler, node-only better-sqlite3).
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

rsync -a --delete \
  --exclude compiler \
  "$DSL_SRC/src/" "$HERE/src/lang/"

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
echo "  $(find "$HERE/src/lang" -name '*.ts' | wc -l | tr -d ' ') TS files in src/lang"
echo "  $(ls "$HERE/src/samples" | wc -l | tr -d ' ') samples in src/samples"
echo "warning: playground/src/lang is generated output - do not edit by hand"
