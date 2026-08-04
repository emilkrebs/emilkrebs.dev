/**
 * The builtin type library — loading, not resolving.
 *
 * builtin/core.bio declares every type the language knows (`substance`,
 * `intervention`, `protocol`, …). Nothing imports it and nothing can shadow it:
 * it is part of the language, the way `Object` is part of JavaScript. The
 * standard library under std/ is the opposite kind of thing — a catalog you
 * import by name and may freely override — and it is deliberately NOT loaded
 * here. See utils/std-lib.ts for the URI schemes that keep the two apart.
 *
 * There are two ways a document can reach the index, and both go through this
 * module so they cannot drift apart:
 *
 *   1. Language server / any workspace — BiohackingWorkspaceManager injects the
 *      library in `loadAdditionalDocuments`, which is Langium's documented hook
 *      for exactly this. The documents are indexed with the workspace, so
 *      scoping, completion and go-to-definition see them like any other file.
 *
 *   2. One-shot parses with no workspace — the compiler, the CLI and tests
 *      never call `initializeWorkspace`, so they call {@link loadBuiltinLibrary}
 *      (or go through parseBioWithImports, which does it for them).
 *
 * Both paths are idempotent and converge on the same document instances, so
 * mixing them within one set of services is safe.
 */
import { type LangiumDocument, type LangiumSharedCoreServices } from 'langium';
import { getBundledSource } from './utils/bundled-content.js';
import { listBuiltinUris } from './utils/std-lib.js';

/**
 * The builtin library documents, registered with `LangiumDocuments`.
 *
 * Documents already managed by the services are returned as-is rather than
 * re-parsed: two AST copies of core.bio would give a reference resolved against
 * one copy and a type looked up in the other, which is the sort of bug that
 * shows up as an inexplicable "unknown type substance".
 */
export function createBuiltinDocuments(shared: LangiumSharedCoreServices): LangiumDocument[] {
    const documents = shared.workspace.LangiumDocuments;
    const factory = shared.workspace.LangiumDocumentFactory;
    const result: LangiumDocument[] = [];

    for (const uri of listBuiltinUris()) {
        const existing = documents.getDocument(uri);
        if (existing) {
            result.push(existing);
            continue;
        }
        const source = getBundledSource(uri);
        if (source === undefined) {
            // Only reachable if the bundle generator and the specifier list
            // disagree; the library is missing either way, and failing here
            // would take down service creation rather than surface it.
            continue;
        }
        const document = factory.fromString(source, uri);
        documents.addDocument(document);
        result.push(document);
    }
    return result;
}

/**
 * Ensures the builtin library is parsed and indexed. Call this before parsing
 * `.bio` text with services that were never given a workspace — without it,
 * `substance "Caffeine"` has no type to resolve against.
 *
 * A no-op once the library is loaded, so callers need not track whether the
 * workspace manager got there first.
 */
export async function loadBuiltinLibrary(shared: LangiumSharedCoreServices): Promise<void> {
    const documents = shared.workspace.LangiumDocuments;
    const missing = listBuiltinUris().filter(uri => !documents.hasDocument(uri));
    if (missing.length === 0) {
        return;
    }
    await shared.workspace.DocumentBuilder.build(createBuiltinDocuments(shared));
}
