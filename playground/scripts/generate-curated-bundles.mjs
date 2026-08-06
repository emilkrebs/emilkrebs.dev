#!/usr/bin/env node
/**
 * Generates the curated bundled library for the public playground.
 *
 * Sources: curated/*.bio — a hand-audited, supplements-only subset of the
 * Healthstack std library. The full library (peptides, hormones, prescription
 * pharmacology) stays in the IDE repo and is deliberately NOT shipped here.
 *
 * Output: src/lang/bundled/bundled-sources.ts + bundled-specifiers.ts
 * (same shape the IDE's generator produces, so langium wiring is unchanged).
 *
 * Run: npm run curated-bundles  (or sync-dsl.sh, which runs this after sync)
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const curatedDir = path.join(root, 'curated');

function load(name) {
  return fs.readFileSync(path.join(curatedDir, name), 'utf8');
}

const STD_SOURCES = {
  '@std/supplements': load('supplements.bio'),
};

const BUILTIN_SOURCES = {
  '@builtin/core': load('builtin-core.bio'),
  '@builtin/interactions': load('interactions.bio'),
};

function emitRecord(entries) {
  return Object.entries(entries)
    .map(([k, v]) => `    ${JSON.stringify(k)}: ${JSON.stringify(v)},`)
    .join('\n');
}

function emitSpecifiers(entries) {
  return Object.keys(entries)
    .map((k) => `    ${JSON.stringify(k)},`)
    .join('\n');
}

const sources = `// GENERATED FILE — DO NOT EDIT.
// Produced by scripts/generate-curated-bundles.mjs from curated/*.bio — a
// hand-audited, supplements-only library for the public playground. The full
// std library lives in the Healthstack IDE repo and is NOT shipped here.
// Regenerate with \`npm run curated-bundles\`.

/** Curated std sources: supplements only. */
export const STD_SOURCES: Readonly<Record<string, string>> = {
${emitRecord(STD_SOURCES)}
};

/** Curated builtin sources: the type library + supplement interaction catalog. */
export const BUILTIN_SOURCES: Readonly<Record<string, string>> = {
${emitRecord(BUILTIN_SOURCES)}
};
`;

const specifiers = `// GENERATED FILE — DO NOT EDIT.
// Produced by scripts/generate-curated-bundles.mjs from curated/*.bio.

/** Import specifiers for every bundled std \`.bio\` file (curated, supplements-only). */
export const STD_SPECIFIERS: readonly string[] = [
${emitSpecifiers(STD_SOURCES)}
];

/** Import specifiers for every bundled builtin \`.bio\` file. */
export const BUILTIN_SPECIFIERS: readonly string[] = [
${emitSpecifiers(BUILTIN_SOURCES)}
];
`;

fs.writeFileSync(path.join(root, 'src/lang/bundled/bundled-sources.ts'), sources);
fs.writeFileSync(path.join(root, 'src/lang/bundled/bundled-specifiers.ts'), specifiers);

console.log('curated bundles regenerated:');
for (const [k] of Object.entries(STD_SOURCES)) console.log(`  std      ${k}`);
for (const [k] of Object.entries(BUILTIN_SOURCES)) console.log(`  builtin  ${k}`);
