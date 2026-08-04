/**
 * parseBioWithImports — parses a .bio document together with its transitive
 * imports so that cross-file references link and imported definitions can be
 * merged into the compiled IR.
 *
 * Browser-safe: file access is delegated to a caller-supplied reader, so this
 * works in the Theia backend (fs), the CLI (fs) and tests (in-memory map).
 */
import { type LangiumDocument, URI, UriUtils } from 'langium';
import type { BiohackingServices } from '../biohacking-module.js';
import { isModel, type Model } from '../generated/ast.js';
import { resolveStdImportUri } from './std-lib.js';
import { getBundledSource } from './bundled-content.js';
import { createBuiltinDocuments } from '../builtin-library.js';

/** Returns the file content for a resolved import URI, or undefined if unreadable. */
export type BioFileReader = (uri: URI) => Promise<string | undefined>;

export interface BioImportParseResult {
    /** The parsed entry model. */
    entry: Model;
    /** Models of all transitively imported documents, in load order. */
    imported: Model[];
    /** The entry document (for diagnostics after a validating build). */
    entryDocument: LangiumDocument;
    /** Import paths (as written in source) that could not be read. */
    missingImports: string[];
}

/**
 * Resolves an import path to a document URI. Supports `@std/<name>` (the
 * bundled standard library, see utils/std-lib.ts) in addition to paths
 * relative to the importing document's URI. Must stay in sync with
 * BiohackingScopeProvider.resolvePath so scoping and loading agree on which
 * file an import refers to.
 */
export function resolveImportUri(importPath: string, baseUri: URI): URI | undefined {
    const stdUri = resolveStdImportUri(importPath);
    if (stdUri) {
        return stdUri;
    }
    try {
        return UriUtils.resolvePath(baseUri, '..', importPath);
    } catch {
        return undefined;
    }
}

export async function parseBioWithImports(
    services: BiohackingServices,
    content: string,
    uri: string | URI,
    readFile?: BioFileReader,
    options?: { validation?: boolean },
): Promise<BioImportParseResult> {
    const entryUri = typeof uri === 'string' ? URI.parse(uri) : uri;
    const factory = services.shared.workspace.LangiumDocumentFactory;
    const builder = services.shared.workspace.DocumentBuilder;

    const documents = new Map<string, LangiumDocument>();
    const missingImports: string[] = [];

    const entryDocument = factory.fromString(content, entryUri);
    documents.set(entryUri.toString(), entryDocument);

    // The builtin type library is always loaded and never imported. Every
    // document depends on it — `substance "Caffeine"` cannot resolve its type,
    // and astToIR cannot compute a trait closure, without core.bio present.
    // These services usually have no workspace, so the workspace manager never
    // ran; loading here covers the compiler, the CLI and tests.
    for (const builtin of createBuiltinDocuments(services.shared)) {
        const key = builtin.uri.toString();
        if (key === entryUri.toString() || documents.has(key)) continue;
        documents.set(key, builtin);
    }

    const queue: LangiumDocument[] = [entryDocument];
    while (queue.length > 0) {
        const doc = queue.shift()!;
        const model = doc.parseResult?.value;
        if (!isModel(model)) continue;
        for (const imp of model.imports) {
            if (!imp.path) continue;
            const importUri = resolveImportUri(imp.path, doc.uri);
            if (!importUri) {
                missingImports.push(imp.path);
                continue;
            }
            const key = importUri.toString();
            if (documents.has(key)) continue;
            // Bundled libraries (@std/*, @builtin/*) are embedded in this
            // package, so they resolve without the caller's reader — which is
            // what lets the browser, the CLI and the backend agree.
            const text = getBundledSource(importUri) ?? (readFile ? await readFile(importUri) : undefined);
            if (text === undefined) {
                missingImports.push(imp.path);
                continue;
            }
            const importedDoc = factory.fromString(text, importUri);
            documents.set(key, importedDoc);
            queue.push(importedDoc);
        }
    }

    await builder.build([...documents.values()], { validation: options?.validation ?? false });

    const entry = entryDocument.parseResult?.value;
    if (!isModel(entry)) {
        throw new Error('Failed to parse .bio content');
    }
    const imported: Model[] = [];
    for (const doc of documents.values()) {
        if (doc === entryDocument) continue;
        const model = doc.parseResult?.value;
        if (isModel(model)) imported.push(model);
    }
    return { entry, imported, entryDocument, missingImports };
}
