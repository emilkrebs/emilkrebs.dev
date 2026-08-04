/**
 * Typir type system for the Biohacking DSL.
 *
 * WHAT TYPIR OWNS AND WHY IT IS ONLY PART OF THE CHECKING
 * ------------------------------------------------------
 * This DSL's type layer is unusual: it is *self-describing*, so every type
 * exists only as an AST node in builtin/core.bio or a user's workspace, and it
 * is *value-dependent* in places — `oneof(active, paused)` and
 * `Vocab<pathway>` are decided by the literal text of a value, not by a type
 * graph. Typir models the first beautifully and the second not at all, so the
 * split is deliberate:
 *
 *   TYPIR OWNS
 *     - the six primitives and the coercions between them
 *       (a bareword satisfies a String member, `true` is also a bareword)
 *     - one nominal class per `type` declaration, with the `extends` chain as
 *       real subtyping — this is what `use substance "X"` is checked against
 *     - assignability of scalar values to members declared with a named type
 *     - `@default_member` as an implicit conversion: `dose: 5 mg` type-checks
 *       against `dose?: Dose` because Measurement is convertible to Dose
 *
 *   biohacking-validator.ts KEEPS
 *     - unknown/required members, duplicate identities, extends cycles
 *     - the value-dependent forms: oneof / Vocab / Ref / list membership
 *     - every trait-gated pharmacology check
 *
 * The two do not overlap: `checkValueTypes` skips exactly the members whose
 * declared type is `typirOwns()`, so a mismatch is reported once, by one layer.
 *
 * NOMINAL, NOT STRUCTURAL. Typir's ClassKind defaults to nominal typing with at
 * most one superclass, which happens to be precisely this DSL's identity rule:
 * `extends` is single, and `substance "X"` collides with `peptide "X"` because
 * they share a hierarchy, not because their fields match.
 */
import { AstUtils } from 'langium';
import type { AstNode } from 'langium';
import type {
    LangiumTypeSystemDefinition,
    TypirLangiumServices,
    TypirLangiumSpecifics,
} from 'typir-langium';
import { InferenceRuleNotApplicable } from 'typir';
import type { Type, ValidationProblemAcceptor } from 'typir';
import type {
    BiohackingAstType,
    EntityDecl,
    MemberDecl,
    Model,
    TypeDecl,
    TypeRef,
    Use,
} from '../generated/ast.js';
import {
    isEntityDecl,
    isNamedTypeRef,
    isScalarAssignment,
    isTypeDecl,
} from '../generated/ast.js';
import {
    defaultMemberOf,
    isPrimitiveType,
    membersOf,
} from '../metamodel/model-index.js';

export interface BiohackingTypirSpecifics extends TypirLangiumSpecifics {
    AstTypes: BiohackingAstType;
}

export type BiohackingTypir = TypirLangiumServices<BiohackingTypirSpecifics>;

/**
 * `Text` is not a distinct Typir type. The pre-Typir checker accepted a quoted
 * string, a ''' block and a bareword interchangeably for both `String` and
 * `Text` members, and collapsing them here preserves that exactly — modelling
 * Text as a supertype of String would need a conversion in each direction,
 * which Typir forbids as an implicit cycle.
 */
const PRIMITIVE_ALIASES: Record<string, string> = { Text: 'String' };

/**
 * True when Typir is responsible for checking values against this declared
 * type. Everything else — `[T]`, `oneof(...)`, `Vocab<d>`, `Ref<T>` — stays
 * with the hand-written validator, which can look at the value's literal text.
 *
 * Exported so biohacking-validator.ts can skip precisely the same set; the two
 * layers must agree or a mismatch is reported twice (or not at all).
 */
export function typirOwns(ref: TypeRef): boolean {
    return isNamedTypeRef(ref);
}

export class BiohackingTypeSystem implements LangiumTypeSystemDefinition<BiohackingTypirSpecifics> {

    onInitialize(typir: BiohackingTypir): void {
        const number = typir.factory.Primitives.create({ primitiveName: 'Number' })
            .inferenceRule({ languageKey: 'NumberValue' })
            .finish();
        const measurement = typir.factory.Primitives.create({ primitiveName: 'Measurement' })
            .inferenceRule({ languageKey: 'Measurement' })
            .finish();
        const string = typir.factory.Primitives.create({ primitiveName: 'String' })
            .inferenceRule({ languageKey: 'TextValue' })
            .finish();
        const ident = typir.factory.Primitives.create({ primitiveName: 'Ident' })
            .inferenceRule({
                languageKey: 'IdentValue',
                matching: (node: AstNode) => !isBooleanLiteral(node),
            })
            .finish();
        const bool = typir.factory.Primitives.create({ primitiveName: 'Bool' })
            .inferenceRule({
                languageKey: 'IdentValue',
                matching: (node: AstNode) => isBooleanLiteral(node),
            })
            .finish();

        // `true` is lexically a bareword, so it satisfies an Ident member; and a
        // bareword satisfies String/Text, which is what makes `group: nootropics`
        // and `goal: "..."` both legal for their respective members. IMPLICIT is
        // transitive, so Bool reaches String through Ident.
        typir.Conversion.markAsConvertible(bool, ident, 'IMPLICIT_EXPLICIT');
        typir.Conversion.markAsConvertible(ident, string, 'IMPLICIT_EXPLICIT');

        // Created for their inference rules; nothing else refers to them here.
        void number;
        void measurement;

        // Registered once, not per TypeDecl: an entity takes its type from the
        // TypeDecl its `type` cross-reference resolves to, whichever that is.
        typir.Inference.addInferenceRulesForAstNodes({
            EntityDecl: (entity: EntityDecl) => entity.type?.ref ?? InferenceRuleNotApplicable,
        });

        typir.validation.Collector.addValidationRulesForAstNodes({
            EntityDecl: (entity, accept) => this.checkAssignments(entity, accept, typir),
            Use: (use, accept) => this.checkUseTarget(use, accept, typir),
        });
    }

    onNewAstNode(node: AstNode, typir: BiohackingTypir): void {
        if (!isTypeDecl(node)) return;

        const fields = this.fieldsOf(node, typir);
        const initializer = typir.factory.Classes.create({
            className: node.name,
            // Resolved by identifier rather than by object reference: core.bio is
            // a different document, and its class may not exist yet when a user
            // file that extends it is processed first.
            superClasses: node.superType?.ref ? classDescriptor(node.superType.ref.name) : undefined,
            fields,
            methods: [],
        })
            // An entity gets its type from the TypeDecl its `type` reference
            // resolves to, so declaring the rule here covers both.
            .inferenceRuleForClassDeclaration({
                languageKey: 'TypeDecl',
                matching: (candidate: AstNode) => candidate === node,
            })
            .finish();

        // `@default_member(amount)` is exactly an implicit conversion: it says a
        // bare `5 mg` may stand where a whole `Dose` is expected. Registered on
        // the initializer because the class type does not exist until every
        // field type it depends on has resolved.
        const defaultMember = defaultMemberOf(node);
        if (defaultMember) {
            const member = membersOf(node).get(defaultMember);
            const source = member && this.resolveTypeRef(member.type, typir);
            if (source) {
                initializer.addListener(classType => {
                    if (typir.Conversion.getConversion(source, classType) === 'NONE') {
                        typir.Conversion.markAsConvertible(source, classType, 'IMPLICIT_EXPLICIT');
                    }
                });
            }
        }
    }

    // ── Type mapping ─────────────────────────────────────────────────────────

    /**
     * Only members Typir can resolve become fields. A field whose type never
     * resolves would leave the whole class stuck in its initializer and silently
     * disable checking for that type, which is far worse than an absent field —
     * and for nominal classes fields do not affect assignability anyway.
     */
    protected fieldsOf(type: TypeDecl, typir: BiohackingTypir): Array<{ name: string; type: Type }> {
        const fields: Array<{ name: string; type: Type }> = [];
        for (const member of type.members) {
            const resolved = this.resolveTypeRef(member.type, typir);
            if (resolved) fields.push({ name: member.name, type: resolved });
        }
        return fields;
    }

    /** The Typir type for a declared member type, or undefined if Typir does not model it. */
    protected resolveTypeRef(ref: TypeRef, typir: BiohackingTypir): Type | undefined {
        if (!isNamedTypeRef(ref)) return undefined;
        const name = PRIMITIVE_ALIASES[ref.typeName] ?? ref.typeName;
        if (isPrimitiveType(name)) {
            return typir.factory.Primitives.get({ primitiveName: name });
        }
        return typir.infrastructure.TypeResolver.tryToResolve(classDescriptor(name));
    }

    // ── Validation ───────────────────────────────────────────────────────────

    protected checkAssignments(
        entity: EntityDecl,
        accept: ValidationProblemAcceptor<BiohackingTypirSpecifics>,
        typir: BiohackingTypir,
    ): void {
        const declared = entity.type?.ref;
        if (!declared) return;
        const members = membersOf(declared, undefined);

        entity.assignments.forEach((assignment, index) => {
            if (!isScalarAssignment(assignment)) return;
            const member: MemberDecl | undefined = members.get(assignment.name);
            // An unknown member is reported by checkUnknownMembers, not here.
            if (!member || !typirOwns(member.type)) return;

            const expected = this.resolveTypeRef(member.type, typir);
            if (!expected) return;

            typir.validation.Constraints.ensureNodeIsAssignable(
                assignment.value, expected, accept,
                (actual, target) => ({
                    message:
                        `Property '${assignment.name}' expects ${target.userRepresentation}, ` +
                        `but got ${actual.userRepresentation}.`,
                    languageNode: entity,
                    languageProperty: 'assignments',
                    languageIndex: index,
                    severity: 'error',
                }),
            );
        });
    }

    /**
     * `use substance "X"` must resolve to something that IS a substance. With
     * the `extends` chain modelled as class subtyping this is a plain
     * assignability question rather than a hand-rolled chain walk.
     */
    protected checkUseTarget(
        use: Use,
        accept: ValidationProblemAcceptor<BiohackingTypirSpecifics>,
        typir: BiohackingTypir,
    ): void {
        const declared = use.type?.ref;
        const target = use.target?.ref;
        if (!declared || !target || !target.type?.ref) return;

        const expected = typir.infrastructure.TypeResolver.tryToResolve(classDescriptor(declared.name));
        if (!expected) return;

        typir.validation.Constraints.ensureNodeIsAssignable(
            target, expected, accept,
            (actual, target2) => ({
                message: `'${use.target.$refText}' is a ${actual.name}, not a ${target2.name}.`,
                languageNode: use,
                languageProperty: 'target',
                severity: 'error',
            }),
        );
    }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * A lazy descriptor for a nominal class, matching ClassKind's identifier scheme
 * (`class-<name>`). Lazy because the referenced class may not exist yet.
 */
function classDescriptor(className: string) {
    return () => `class-${className}`;
}

function isBooleanLiteral(node: AstNode): boolean {
    const value = (node as { value?: unknown }).value;
    return value === 'true' || value === 'false';
}

/** Every TypeDecl reachable from a node's own document. Used by tests. */
export function typeDeclsOf(node: AstNode): TypeDecl[] {
    const model = AstUtils.getContainerOfType(node, (n): n is Model => n.$type === 'Model');
    return model ? model.declarations.filter(isTypeDecl) : [];
}

/** Entities declared directly in a model. Used by tests. */
export function entityDeclsOf(model: Model): EntityDecl[] {
    return model.declarations.filter(isEntityDecl);
}
