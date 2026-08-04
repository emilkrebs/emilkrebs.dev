#!/usr/bin/env node
/**
 * Bundles the Healthstack DSL language server into ONE minified artifact for
 * the PUBLIC playground.
 *
 * The readable implementation (grammar, validators, type system, IR) lives
 * only in the private biohacking-ide repo. This script copies it to a temp
 * dir, bundles it with esbuild (minified, no sourcemap, mangled names), and
 * writes the artifact to src/lang/vendor/biohacking-language.min.mjs — the
 * only thing the public repo commits.
 *
 * Two imports stay EXTERNAL (resolved at runtime against this repo):
 *   ../bundled/bundled-sources.js / bundled-specifiers.js
 * i.e. the curated supplements-only .bio content, which remains editable
 * in the public repo without needing the private one.
 *
 * Usage:
 *   BIOHACKING_IDE=/path/to/biohacking-ide node scripts/build-lang-bundle.mjs
 */
import { build } from 'esbuild';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const HERE = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const IDE = process.env.BIOHACKING_IDE;
if (!IDE) {
  console.error('error: BIOHACKING_IDE is not set');
  process.exit(1);
}
const DSL_SRC = path.join(IDE, 'extensions/biohacking-dsl/packages/language/src');
if (!fs.existsSync(DSL_SRC)) {
  console.error(`error: DSL package not found at ${DSL_SRC}`);
  process.exit(1);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'biohacking-lang-'));
try {
  // 1. copy the private implementation (no compiler, no bundled content)
  execSync(`rsync -a --exclude compiler --exclude bundled "${DSL_SRC}/" "${tmp}/src/"`);

  // 2. entry: the package API + the TextMate grammar (embedded, minified)
  //    (no bundled/ dir is copied on purpose: curated-content imports are
  //    externalised by the plugin below, and anything else would fail loudly)
  fs.writeFileSync(
    path.join(tmp, 'src', 'bundle-entry.ts'),
    [
      "export * from './index.js';",
      "import grammarJson from './syntaxes/biohacking.tmLanguage.json';",
      'export const grammarSource: string = JSON.stringify(grammarJson);',
      '',
    ].join('\n'),
  );

  // 4. minify → public artifact
  const out = path.join(HERE, 'src/lang/vendor/biohacking-language.min.mjs');
  fs.mkdirSync(path.dirname(out), { recursive: true });

  // Preserve the curated-content imports verbatim instead of rewriting them:
  // the artifact must import '../bundled/bundled-sources.js' so it resolves
  // against THIS repo's src/lang/bundled/ at runtime (the curated .bio
  // content stays editable here without the private repo).
  const curatedExternal = {
    name: 'curated-external',
    setup(build) {
      build.onResolve({ filter: /^\.\.\/bundled\/bundled-(sources|specifiers)\.js$/ }, (args) => ({
        path: args.path,
        external: true,
      }));
    },
  };

  await build({
    entryPoints: [path.join(tmp, 'src', 'bundle-entry.ts')],
    bundle: true,
    format: 'esm',
    minify: true,
    target: 'es2020',
    legalComments: 'none',
    // public npm packages stay external; the curated .bio content stays in
    // this repo (src/lang/bundled/) and is imported by the artifact at runtime
    external: [
      'langium',
      'vscode-languageserver',
      'vscode-languageserver-types',
      'vscode-uri',
      'typir',
      'typir-langium',
      'vscode-oniguruma',
      'vscode-textmate',
    ],
    plugins: [curatedExternal],
    // the entry lives in a temp dir outside the project, so point esbuild at
    // the playground's node_modules for bare imports
    nodePaths: [path.join(HERE, 'node_modules')],
    outfile: out,
    logLevel: 'warning',
  });

  const kb = (fs.statSync(out).size / 1024).toFixed(1);
  console.log(`bundled language server → src/lang/vendor/biohacking-language.min.mjs (${kb} KB, minified, no sourcemap)`);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
