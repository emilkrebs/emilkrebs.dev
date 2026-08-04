import { LangiumDocument, LangiumDocuments, MaybePromise, UriUtils } from "langium";
import { CompletionAcceptor, CompletionContext, DefaultCompletionProvider, LangiumServices, NextFeature } from "langium/lsp";
import { CompletionItemKind } from 'vscode-languageserver-types';
import { collectConflictSynergyCandidates, collectGroups, collectRoutes, collectUnits } from "./utils/ast-utils.js";
import { listStdImportSpecifiers } from './utils/std-lib.js';
import { AstUtils } from "langium";
import { isEntityDecl, isScalarAssignment, Model } from "./generated/ast.js";
import { MetamodelIndex, describeTypeRef, membersOf } from "./metamodel/model-index.js";

export class BiohackingCompletionProvider extends DefaultCompletionProvider {
    private readonly documents: () => LangiumDocuments;

    constructor(services: LangiumServices) {
        super(services);
        this.documents = () => services.shared.workspace.LangiumDocuments;
    }

    protected override completionFor(context: CompletionContext, next: NextFeature, acceptor: CompletionAcceptor): MaybePromise<void> {
        if (next.property === 'path') {
            this.completeImportPath(context, acceptor);
        }
        else if (next.property === 'route') {
            this.completeRoutes(context, acceptor);
        }
        else if (next.property === 'group') {
            this.completeGroups(context, acceptor);
        }
        else if (next.property === 'unit') {
            this.completeUnits(context, acceptor);
        }
        else if (next.type === 'ScalarAssignment' && next.property === 'name') {
            this.completeMemberNames(context, acceptor);
        }
        else if (next.property === 'value') {
            this.completeMemberValue(context, acceptor);
        }
        else {
            return super.completionFor(context, next, acceptor);
        }
    }

    private completeImportPath(context: CompletionContext, acceptor: CompletionAcceptor): void {
        const text = context.textDocument.getText();
        const existingText = text.substring(context.offset, context.tokenEndOffset);
        let allPaths = [...new Set([...this.getAllFiles(context.document), ...listStdImportSpecifiers()])];
        let range = {
            start: context.position,
            end: context.position
        };
        if (existingText.length > 0) {
            const existingPath = existingText.substring(1);
            allPaths = allPaths.filter(path => path.startsWith(existingPath));
            // Completely replace the current token
            const start = context.textDocument.positionAt(context.tokenOffset + 1);
            const end = context.textDocument.positionAt(context.tokenEndOffset - 1);
            range = {
                start,
                end
            };
        }
        for (const path of allPaths) {
            // Only insert quotes if there is no `path` token yet.
            const delimiter = existingText.length > 0 ? '' : '"';
            const completionValue = `${delimiter}${path}${delimiter}`;
            acceptor(context, {
                label: path,
                textEdit: {
                    newText: completionValue,
                    range
                },
                kind: CompletionItemKind.File,
                sortText: '0'
            });
        }
    }

    private completeFromModel<T>(
        context: CompletionContext,
        acceptor: CompletionAcceptor,
        collector: (model: Model) => Set<T>,
        documentationPrefix: string,
        getValue: (item: T) => string = (item) => String(item)
    ): void {
        const model = context.document.parseResult?.value as Model;
        if (!model) {
            return;
        }

        const currentText = context.textDocument.getText().substring(context.tokenOffset, context.tokenEndOffset);
        const items = collector(model);
        items.delete(currentText as T);

        for (const item of items) {
            const value = getValue(item);
            acceptor(context, {
                label: value,
                documentation: `${documentationPrefix}: ${value}`,
                insertText: value,
                kind: CompletionItemKind.Value,
                sortText: '0'
            });
        }
    }

    private completeRoutes(context: CompletionContext, acceptor: CompletionAcceptor): void {
        this.completeFromModel(context, acceptor, collectRoutes, 'Route of administration');
    }

    private completeGroups(context: CompletionContext, acceptor: CompletionAcceptor): void {
        this.completeFromModel(context, acceptor, collectGroups, 'Group');
    }

    private completeUnits(context: CompletionContext, acceptor: CompletionAcceptor): void {
        this.completeFromModel(context, acceptor, collectUnits, 'Unit');
    }

    /**
     * Offers the members the enclosing entity's type declares, minus the ones
     * already written.
     *
     * There is no per-type list here: `substance` and a user's `training` are
     * completed by the same code reading the same metamodel, so a member added
     * to builtin/core.bio shows up with no change to this file.
     */
    private completeMemberNames(context: CompletionContext, acceptor: CompletionAcceptor): void {
        const entity = AstUtils.getContainerOfType(context.node, isEntityDecl);
        const type = entity?.type?.ref;
        if (!entity || !type) return;

        const index = MetamodelIndex.forNode(entity);
        const used = new Set(entity.assignments.flatMap(a =>
            (a.$type === 'ScalarAssignment' || a.$type === 'StructAssignment') ? [a.name] : []));

        for (const [name, member] of membersOf(type, index)) {
            if (used.has(name)) continue;
            acceptor(context, {
                label: name,
                documentation: `${describeTypeRef(member.type)}${member.optional ? '' : ' (required)'}`,
                insertText: `${name}: `,
                kind: CompletionItemKind.Field,
                sortText: member.optional ? '1' : '0',
            });
        }
    }

    /**
     * Offers values appropriate to the member being assigned: the members of a
     * `oneof`, or every value already used in a `Vocab` domain across the
     * document. Replaces hardcoded TIME_OF_DAY_VOCAB / PROTOCOL_STATUS_VOCAB
     * lists, which now live in core.bio as declared types.
     */
    private completeMemberValue(context: CompletionContext, acceptor: CompletionAcceptor): void {
        const assignment = AstUtils.getContainerOfType(context.node, isScalarAssignment);
        const entity = assignment && AstUtils.getContainerOfType(assignment, isEntityDecl);
        const type = entity?.type?.ref;
        if (!assignment || !type) return;

        const member = membersOf(type, MetamodelIndex.forNode(entity)).get(assignment.name);
        if (!member) return;

        let ref: any = member.type;
        while (ref?.$type === 'ListTypeRef') ref = ref.element;

        if (ref?.$type === 'EnumTypeRef') {
            for (const value of ref.values as string[]) {
                acceptor(context, {
                    label: value,
                    documentation: `${assignment.name}: ${value}`,
                    insertText: value,
                    kind: CompletionItemKind.EnumMember,
                    sortText: '0',
                });
            }
            return;
        }

        if (ref?.$type === 'VocabTypeRef') {
            const model = context.document.parseResult?.value as Model;
            if (!model) return;
            for (const value of collectConflictSynergyCandidates(model)) {
                acceptor(context, {
                    label: value,
                    documentation: `${ref.domain}: ${value}`,
                    insertText: `"${value}"`,
                    kind: CompletionItemKind.Value,
                    sortText: '0',
                });
            }
        }
    }

    private getAllFiles(document: LangiumDocument): string[] {
        const documents = this.documents().all;
        const uri = document.uri.toString();
        const dirname = UriUtils.dirname(document.uri).toString();
        const paths: string[] = [];
        for (const doc of documents) {
            if (!UriUtils.equals(doc.uri, uri)) {
                const docUri = doc.uri.toString();
                const uriWithoutExt = docUri.substring(0, docUri.length);
                let relativePath = UriUtils.relative(dirname, uriWithoutExt);
                if (!relativePath.startsWith('.')) {
                    relativePath = `./${relativePath}`;
                }
                paths.push(relativePath);
            }
        }
        return paths;
    }
}