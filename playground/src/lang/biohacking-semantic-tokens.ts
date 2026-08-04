/**
 * Semantic highlighting for the Biohacking DSL.
 *
 * WHY THIS EXISTS AT ALL. The DSL is self-describing, so the only reserved
 * words are `import type is extends oneof Vocab Ref use`. `substance`,
 * `intervention`, `half_life` and `mcg` are ordinary IDs — a TextMate grammar
 * can guess at them from shape (see src/syntaxes/biohacking.tmLanguage.json)
 * but cannot know that `intervention` names a type while `peptide` on the next
 * line names a value. The linker does know: `EntityDecl.type` is a real
 * cross-reference into core.bio.
 *
 * WHY LANGIUM DOES NOT DO THIS FOR US. Being a cross-reference already buys
 * go-to-definition, hover, rename and find-references. It does not buy colour:
 * `LangiumLspServices.SemanticTokenProvider` is optional and unbound in
 * Langium's default LSP module, and `highlightElement` is abstract. Colour is
 * opt-in, and this is the opt-in.
 *
 * The two layers compose rather than compete — semantic tokens win wherever
 * they cover a range, and TextMate keeps everything else (units, punctuation,
 * comments, free-text strings) so a file still looks right before the server
 * has answered, and in any client with semantic tokens turned off.
 */
import type { AstNode } from 'langium';
import { AbstractSemanticTokenProvider, type SemanticTokenAcceptor } from 'langium/lsp';
import { SemanticTokenTypes, SemanticTokenModifiers } from 'vscode-languageserver';
import {
    isAnnotation,
    isEntityDecl,
    isEnumTypeRef,
    isIdentValue,
    isImport,
    isMemberDecl,
    isNamedTypeRef,
    isRefTypeRef,
    isScalarAssignment,
    isStructAssignment,
    isTypeDecl,
    isUse,
    isVocabTypeRef,
} from './generated/ast.js';
import { isPrimitiveType } from './metamodel/model-index.js';

export class BiohackingSemanticTokenProvider extends AbstractSemanticTokenProvider {

    protected highlightElement(node: AstNode, acceptor: SemanticTokenAcceptor): void {
        // ── Metamodel layer ──────────────────────────────────────────────────
        if (isTypeDecl(node)) {
            acceptor({
                node, property: 'name',
                type: SemanticTokenTypes.class,
                modifier: [SemanticTokenModifiers.declaration, SemanticTokenModifiers.definition],
            });
            if (node.superType) {
                acceptor({ node, property: 'superType', type: SemanticTokenTypes.class });
            }
            // Traits are a closed, host-owned vocabulary naming behaviour the
            // validator dispatches on — the closest standard token is `interface`.
            node.traits.forEach((_, index) => {
                acceptor({ node, property: 'traits', index, type: SemanticTokenTypes.interface });
            });
            return;
        }

        if (isMemberDecl(node)) {
            acceptor({
                node, property: 'name',
                type: SemanticTokenTypes.property,
                modifier: SemanticTokenModifiers.declaration,
            });
            return;
        }

        if (isNamedTypeRef(node)) {
            // Primitives have no declaration to link to, so they read as
            // builtins; everything else resolves to a TypeDecl.
            acceptor({
                node, property: 'typeName',
                type: isPrimitiveType(node.typeName)
                    ? SemanticTokenTypes.type
                    : SemanticTokenTypes.class,
                modifier: isPrimitiveType(node.typeName)
                    ? SemanticTokenModifiers.defaultLibrary
                    : [],
            });
            return;
        }

        if (isRefTypeRef(node)) {
            acceptor({ node, property: 'target', type: SemanticTokenTypes.class });
            return;
        }

        if (isVocabTypeRef(node)) {
            // An OPEN vocabulary domain: a namespace of free strings, not a type.
            acceptor({ node, property: 'domain', type: SemanticTokenTypes.namespace });
            return;
        }

        if (isEnumTypeRef(node)) {
            node.values.forEach((_, index) => {
                acceptor({ node, property: 'values', index, type: SemanticTokenTypes.enumMember });
            });
            return;
        }

        if (isAnnotation(node)) {
            acceptor({ node, property: 'name', type: SemanticTokenTypes.decorator });
            node.args.forEach((arg, index) => {
                if (arg.identValue !== undefined) {
                    acceptor({
                        node: node.args[index], property: 'identValue',
                        type: SemanticTokenTypes.parameter,
                    });
                }
            });
            return;
        }

        // ── Instance layer ───────────────────────────────────────────────────
        if (isEntityDecl(node)) {
            // The whole point of this file: `intervention` is an ID token that
            // the linker resolves to a TypeDecl in core.bio.
            acceptor({ node, property: 'type', type: SemanticTokenTypes.class });
            // Colouring the quoted name as a declaration rather than a string is
            // deliberate — it separates an entity's identity from free text like
            // `goal: "Enhance growth hormone pulsatility"`.
            acceptor({
                node, property: 'name',
                type: SemanticTokenTypes.variable,
                modifier: [SemanticTokenModifiers.declaration, SemanticTokenModifiers.readonly],
            });
            if (node.superType) {
                acceptor({ node, property: 'superType', type: SemanticTokenTypes.variable });
            }
            return;
        }

        if (isUse(node)) {
            acceptor({ node, property: 'type', type: SemanticTokenTypes.class });
            acceptor({
                node, property: 'target',
                type: SemanticTokenTypes.variable,
                modifier: SemanticTokenModifiers.readonly,
            });
            return;
        }

        if (isScalarAssignment(node) || isStructAssignment(node)) {
            acceptor({ node, property: 'name', type: SemanticTokenTypes.property });
            return;
        }

        if (isIdentValue(node)) {
            // A bare word used as a value — `route: subcutaneous`, `group: morning`.
            // Distinguishing it from a property name is what stops an entity body
            // from rendering as one flat colour.
            acceptor({
                node, property: 'value',
                type: node.value === 'true' || node.value === 'false'
                    ? SemanticTokenTypes.keyword
                    : SemanticTokenTypes.enumMember,
            });
            return;
        }

        if (isImport(node)) {
            acceptor({ node, property: 'path', type: SemanticTokenTypes.string });
            return;
        }
    }
}
