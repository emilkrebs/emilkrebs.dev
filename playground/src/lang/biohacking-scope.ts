
import { DefaultScopeProvider, type ReferenceInfo, type Scope, type AstNodeDescription, MapScope, AstUtils, type LangiumDocument } from 'langium';
import type { LangiumServices } from 'langium/lsp';
import { isModel, type Model } from './generated/ast.js';
import { URI, Utils } from 'vscode-uri';
import { isBuiltinUri, resolveStdImportUri } from './utils/std-lib.js';
import { getBundledSource } from './utils/bundled-content.js';

export class BiohackingScopeProvider extends DefaultScopeProvider {
    private readonly documentFactory;
    private readonly importedModelCache = new Map<string, { model: Model; document: LangiumDocument }>();
    private readonly missingImportUris = new Set<string>();

    constructor(services: LangiumServices) {
        super(services);
        this.documentFactory = services.shared.workspace.LangiumDocumentFactory;
    }

    override getScope(context: ReferenceInfo): Scope {
        const scope = super.getScope(context);

        // `use substance "BPC-157"` and `use intervention "BPC-157"` must resolve
        // to DIFFERENT entities. Both are EntityDecls, so the reference type
        // alone cannot disambiguate them — the declared type in the `use` has to
        // narrow the candidates. Without this the linker picks whichever came
        // first and the wrong entity silently wins.
        if (context.container.$type === 'Use' && context.property === 'target') {
            const declared = (context.container as { type?: { ref?: { name: string } } }).type?.ref;
            if (declared) {
                return this.filterByEntityType(scope, declared.name);
            }
        }
        return scope;
    }

    /**
     * Narrows a scope to entities whose type is `typeName` or extends it —
     * substitutability, so `use substance "X"` accepts a peptide named X.
     *
     * Candidates whose AST node is not loaded are kept rather than dropped:
     * being permissive here means a reference still links and the validator
     * reports the mismatch, which is a better failure than an unresolved
     * reference with no explanation.
     */
    private filterByEntityType(scope: Scope, typeName: string): Scope {
        const matches = (description: AstNodeDescription): boolean => {
            const node = description.node as
                | { $type?: string; type?: { ref?: { name: string; superType?: unknown } } }
                | undefined;
            if (!node || node.$type !== 'EntityDecl') return true;

            let current = node.type?.ref as
                | { name: string; superType?: { ref?: unknown } }
                | undefined;
            const seen = new Set<unknown>();
            while (current && !seen.has(current)) {
                if (current.name === typeName) return true;
                seen.add(current);
                current = current.superType?.ref as typeof current;
            }
            return false;
        };

        return new MapScope([...scope.getAllElements()].filter(matches));
    }

    protected override getGlobalScope(referenceType: string, context: ReferenceInfo): Scope {
        const model = AstUtils.getContainerOfType(context.container, isModel);
        if (!model) {
            return super.getGlobalScope(referenceType, context);
        }

        const imports = new Set<string>();
        const doc = AstUtils.getDocument(context.container);
        const docUri = doc.uri.toString();

        for (const imp of model.imports) {
            if (imp.path) {
                const resolvedUri = this.resolvePath(imp.path, doc.uri);
                if (resolvedUri) {
                    imports.add(resolvedUri);
                }
            }
        }

        const allDescriptions = this.indexManager.allElements(referenceType);
        const accessibleDescriptions: AstNodeDescription[] = [];
        const builtinDescriptions: AstNodeDescription[] = [];

        for (const desc of allDescriptions) {
            // The builtin type library is ALWAYS in scope and is never imported.
            // Without this, `substance "Caffeine"` in std/ would not resolve its
            // type, since std/ imports nothing. Only the builtin library gets
            // this treatment — user type declarations stay import-gated exactly
            // like entities, so the language keeps one scoping rule rather than
            // two. It is BiohackingWorkspaceManager that puts these in the index
            // (see builtin-library.ts); nothing here parses them.
            if (isBuiltinUri(desc.documentUri)) {
                builtinDescriptions.push(desc);
                continue;
            }
            const descUri = desc.documentUri.toString();
            if (descUri === docUri || imports.has(descUri)) {
                accessibleDescriptions.push(desc);
            }
        }

        // Imported std files live outside the user workspace and may not be
        // part of IndexManager's global descriptions; load them lazily so
        // `use substance "Fluoxetine"` works after `import "@std/..."`.
        const importedDescriptions = this.getImportedDescriptions(referenceType, model, doc.uri);

        // Builtins last: MapScope is last-wins, and a name from the type library
        // must not be shadowed by a workspace or std declaration.
        return new MapScope([
            ...accessibleDescriptions,
            ...importedDescriptions,
            ...builtinDescriptions,
        ]);
    }

    private getImportedDescriptions(referenceType: string, model: Model, baseUri: URI): AstNodeDescription[] {
        const result: AstNodeDescription[] = [];
        const visited = new Set<string>();
        const queue: URI[] = [];

        for (const imp of model.imports) {
            if (!imp.path) continue;
            const resolved = this.resolvePath(imp.path, baseUri);
            if (resolved) {
                queue.push(URI.parse(resolved));
            }
        }

        while (queue.length > 0) {
            const uri = queue.shift()!;
            const key = uri.toString();
            if (visited.has(key)) continue;
            visited.add(key);

            const loaded = this.loadImportedModel(uri);
            if (!loaded) continue;

            for (const declaration of loaded.model.declarations) {
                const name = this.nameProvider.getName(declaration);
                if (!name) continue;
                if (!this.reflection.isSubtype(declaration.$type, referenceType)) continue;
                result.push(this.descriptions.createDescription(declaration, name, loaded.document));
            }

            for (const nestedImport of loaded.model.imports) {
                if (!nestedImport.path) continue;
                const nestedUri = this.resolvePath(nestedImport.path, uri);
                if (nestedUri) {
                    queue.push(URI.parse(nestedUri));
                }
            }
        }

        return result;
    }

    private loadImportedModel(uri: URI): { model: Model; document: LangiumDocument } | undefined {
        const key = uri.toString();
        const cached = this.importedModelCache.get(key);
        if (cached) {
            return cached;
        }
        if (this.missingImportUris.has(key)) {
            return undefined;
        }
        const text = this.readDocumentText(uri);
        if (text !== undefined) {
            const document = this.documentFactory.fromString(text, uri);
            const parsed = document.parseResult?.value;
            if (isModel(parsed)) {
                const loaded = { model: parsed, document };
                this.importedModelCache.set(key, loaded);
                return loaded;
            }
        }
        this.missingImportUris.add(key);
        return undefined;
    }

    /**
     * Reads an imported document's text. Bundled libraries (`@std/*`,
     * `@builtin/*`) are embedded in the language package and resolve without
     * touching the filesystem; everything else is a user file on disk.
     */
    private readDocumentText(uri: URI): string | undefined {
        const bundled = getBundledSource(uri);
        if (bundled !== undefined) {
            return bundled;
        }
        if (uri.scheme !== 'file') {
            return undefined;
        }
        try {
            const req = eval('require') as (name: string) => any;
            const fs = req('fs') as { readFileSync: (path: string, encoding: string) => string };
            return fs.readFileSync(uri.fsPath, 'utf-8');
        } catch {
            return undefined;
        }
    }

    /**
     * Resolves an import path to a document URI. Supports two forms:
     *  - `@std/<name>` — the bundled standard library (see utils/std-lib.ts).
     *  - anything else — a relative path against the importing document.
     * Must stay in sync with resolveImportUri in utils/import-loader.ts so
     * scoping and document loading agree on which file an import refers to.
     */
    private resolvePath(importPath: string, baseUri: URI): string | undefined {
        const stdUri = resolveStdImportUri(importPath);
        if (stdUri) {
            return stdUri.toString();
        }
        try {
            return Utils.resolvePath(baseUri, '..', importPath).toString();
        } catch (e) {
            return undefined;
        }
    }
}
