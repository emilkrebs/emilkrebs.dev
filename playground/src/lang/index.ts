export * from './biohacking-module.js';
export * from './biohacking-validator.js';
export * from './biohacking-workspace.js';
export * from './biohacking-semantic-tokens.js';
export * from './biohacking-documentation-provider.js';
export * from './typir/biohacking-type-system.js';
export * from './builtin-library.js';
export * from './generated/ast.js';
export * from './generated/grammar.js';
export * from './generated/module.js';

export * from './utils/ast-utils.js';
export * from './utils/import-loader.js';
export * from './utils/std-lib.js';
export * from './utils/bundled-content.js';
export * from './utils/evidence-utils.js';
export * from './data/interaction-catalog.js';

// ── Compiler IR (browser-safe) ───────────────────────────────────────────────
export * from './ir/index.js';

// ── AST → IR translator (browser-safe) ──────────────────────────────────────
export { astToIR, withInteractions } from './translator/ast-to-ir.js';
