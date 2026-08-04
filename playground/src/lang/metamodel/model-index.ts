/**
 * MetamodelIndex — resolves the type layer for a parsed document.
 *
 * The grammar is generic, so everything that used to be enforced by parser
 * rules ("a substance has a half_life") is now enforced here against
 * builtin/core.bio and any user `type` declarations. This module is the single
 * place that knows what a type IS; the validator and completion provider both
 * read from it rather than re-deriving.
 *
 * Browser-safe: pure AST/graph work, no Node.js imports.
 */
import { AstUtils } from 'langium';
import type { AstNode } from 'langium';
import type { EntityDecl, MemberDecl, Model, TypeDecl, TypeRef, Value } from '../generated/ast.js';
import {
    isEntityDecl,
    isIdentValue,
    isListValue,
    isMeasurement,
    isNumberValue,
    isTextValue,
    isTypeDecl,
} from '../generated/ast.js';

/**
 * Types with no declaration — they are produced by the lexer, not by core.bio.
 * `Ident` is an unquoted bareword (`group: nootropics`); `Text` additionally
 * admits the ''' multiline form.
 */
export const PRIMITIVE_TYPES = ['Number', 'String', 'Text', 'Bool', 'Ident', 'Measurement'] as const;
export type PrimitiveType = typeof PRIMITIVE_TYPES[number];

export function isPrimitiveType(name: string): name is PrimitiveType {
    return (PRIMITIVE_TYPES as readonly string[]).includes(name);
}

/** The closed, host-owned trait vocabulary — decision 13. */
export const KNOWN_TRAITS = ['pharmacokinetic', 'interacting', 'schedulable'] as const;

/**
 * The closed vocabulary for `@color(...)` on a type declaration. These name
 * the render layer's palette slots, not literal CSS colors — the UI decides
 * what shade "violet" resolves to. Unlike `@icon`, which draws from baukasten-ui's
 * 600+ codicon names and is intentionally left unvalidated here, this set is
 * small and host-owned, so an out-of-vocabulary value is worth a warning.
 */
export const COLOR_VOCAB = ['violet', 'blue', 'sky', 'emerald', 'amber', 'rose', 'slate'] as const;
export type ColorName = typeof COLOR_VOCAB[number];

export class MetamodelIndex {
    private readonly types = new Map<string, TypeDecl>();

    /**
     * Builds the index from a document plus every type reachable through its
     * imports. Type declarations resolve globally rather than per-import, which
     * is what lets std/ reference `substance` without importing core.bio.
     */
    constructor(root: Model, additionalTypes: TypeDecl[] = []) {
        for (const decl of root.declarations) {
            if (isTypeDecl(decl)) this.types.set(decl.name, decl);
        }
        for (const type of additionalTypes) {
            if (!this.types.has(type.name)) this.types.set(type.name, type);
        }
    }

    /** Builds an index from any node by walking up to its Model. */
    static forNode(node: AstNode, additionalTypes: TypeDecl[] = []): MetamodelIndex | undefined {
        const model = AstUtils.getContainerOfType(node, (n): n is Model => n.$type === 'Model');
        return model ? new MetamodelIndex(model, additionalTypes) : undefined;
    }

    get(name: string): TypeDecl | undefined {
        return this.types.get(name);
    }

    has(name: string): boolean {
        return this.types.has(name);
    }

    allTypeNames(): string[] {
        return [...this.types.keys()];
    }

    /** `type` and every type it transitively extends, nearest first. */
    chain(typeName: string): TypeDecl[] {
        const start = this.types.get(typeName);
        return start ? chainOf(start, this) : [];
    }

    /** True when `typeName` is `ancestor` or extends it — the Ref<> subtype rule. */
    isSubtypeOf(typeName: string, ancestor: string): boolean {
        return this.chain(typeName).some(t => t.name === ancestor);
    }

    /** Detects a cycle in the extends chain, returning the repeated type name. */
    extendsCycle(typeName: string): string | undefined {
        const seen = new Set<string>();
        let current = this.types.get(typeName);
        while (current) {
            if (seen.has(current.name)) return current.name;
            seen.add(current.name);
            const superName = current.superType?.$refText;
            if (!superName) return undefined;
            if (seen.has(superName)) return superName;
            current = this.types.get(superName);
        }
        return undefined;
    }

    /** Every member visible on a type, including inherited ones. Subtype wins. */
    members(typeName: string): Map<string, MemberDecl> {
        const result = new Map<string, MemberDecl>();
        // Walk furthest ancestor first so nearer declarations overwrite.
        for (const type of this.chain(typeName).reverse()) {
            for (const member of type.members) {
                result.set(member.name, member);
            }
        }
        return result;
    }

    member(typeName: string, memberName: string): MemberDecl | undefined {
        return this.members(typeName).get(memberName);
    }

    /** Full trait closure across the extends chain. */
    traits(typeName: string): Set<string> {
        const result = new Set<string>();
        for (const type of this.chain(typeName)) {
            for (const trait of type.traits) result.add(trait);
        }
        return result;
    }

    hasTrait(typeName: string, trait: string): boolean {
        return this.traits(typeName).has(trait);
    }

    /** The member named by `@default_member(x)`, used for `dose: 5 mg` shorthand. */
    defaultMember(typeName: string): string | undefined {
        for (const type of this.chain(typeName)) {
            const annotation = type.annotations.find(a => a.name === 'default_member');
            const arg = annotation?.args[0];
            if (arg?.identValue) return arg.identValue;
        }
        return undefined;
    }
}

// ── Reference-based resolution ───────────────────────────────────────────────
//
// These work from RESOLVED cross-references rather than name lookup, so they
// cross document boundaries for free. `substance` is declared in core.bio and
// used in std/; the linker already connected them, and re-deriving that from a
// per-document name index would silently miss it.

/** `type` and every type it transitively extends, nearest first. */
export function chainOf(type: TypeDecl, fallback?: MetamodelIndex): TypeDecl[] {
    const result: TypeDecl[] = [];
    const seen = new Set<TypeDecl>();
    let current: TypeDecl | undefined = type;
    while (current && !seen.has(current)) {
        seen.add(current);
        result.push(current);
        // Prefer the linker's resolution; fall back to name lookup only when
        // the reference did not resolve.
        const superName: string | undefined = current.superType?.$refText;
        current = current.superType?.ref
            ?? (superName ? fallback?.get(superName) : undefined);
    }
    return result;
}

/** Every member visible on a type, including inherited ones. Subtype wins. */
export function membersOf(type: TypeDecl, fallback?: MetamodelIndex): Map<string, MemberDecl> {
    const result = new Map<string, MemberDecl>();
    for (const current of chainOf(type, fallback).reverse()) {
        for (const member of current.members) result.set(member.name, member);
    }
    return result;
}

export function traitsOf(type: TypeDecl, fallback?: MetamodelIndex): Set<string> {
    const result = new Set<string>();
    for (const current of chainOf(type, fallback)) {
        for (const trait of current.traits) result.add(trait);
    }
    return result;
}

export function hasTraitDecl(type: TypeDecl, trait: string, fallback?: MetamodelIndex): boolean {
    return traitsOf(type, fallback).has(trait);
}

/** True when `type` is `ancestor` or extends it — the Ref<> subtype rule. */
export function isSubtypeOfDecl(type: TypeDecl, ancestor: TypeDecl, fallback?: MetamodelIndex): boolean {
    return chainOf(type, fallback).some(t => t === ancestor || t.name === ancestor.name);
}

/** The member named by `@default_member(x)`, powering `dose: 5 mg` shorthand. */
export function defaultMemberOf(type: TypeDecl, fallback?: MetamodelIndex): string | undefined {
    for (const current of chainOf(type, fallback)) {
        const annotation = current.annotations.find(a => a.name === 'default_member');
        const arg = annotation?.args[0];
        if (arg?.identValue) return arg.identValue;
    }
    return undefined;
}

/** Detects a cycle in a resolved extends chain, returning the repeated type. */
export function extendsCycleOf(type: TypeDecl, fallback?: MetamodelIndex): string | undefined {
    const seen = new Set<TypeDecl>();
    let current: TypeDecl | undefined = type;
    while (current) {
        if (seen.has(current)) return current.name;
        seen.add(current);
        const superName: string | undefined = current.superType?.$refText;
        const next: TypeDecl | undefined =
            current.superType?.ref ?? (superName ? fallback?.get(superName) : undefined);
        if (next && seen.has(next)) return next.name;
        current = next;
    }
    return undefined;
}

// ── Assignability ────────────────────────────────────────────────────────────

export interface TypeMismatch {
    /** Human-readable expected type, e.g. `[Vocab<pathway>]`. */
    expected: string;
    /** What the value actually looked like, e.g. `a number`. */
    actual: string;
}

export function describeTypeRef(ref: TypeRef): string {
    switch (ref.$type) {
        case 'ListTypeRef': return `[${describeTypeRef(ref.element)}]`;
        case 'EnumTypeRef': return `oneof(${ref.values.join(', ')})`;
        case 'VocabTypeRef': return `Vocab<${ref.domain}>`;
        case 'RefTypeRef': return `Ref<${ref.target.$refText}>`;
        default: return (ref as { typeName: string }).typeName;
    }
}

function describeValue(value: Value): string {
    if (isMeasurement(value)) return 'a measurement';
    if (isNumberValue(value)) return 'a number';
    if (isTextValue(value)) return 'a string';
    if (isListValue(value)) return 'a list';
    if (isIdentValue(value)) return `the identifier '${value.value}'`;
    return 'a value';
}

/**
 * Checks a value against a declared member type.
 * Returns undefined when assignable, or a description of the mismatch.
 *
 * Two coercions are deliberate and load-bearing for source compatibility:
 *  - a bare scalar satisfies a list type (`tracks: "ALT"`)
 *  - a scalar satisfies a struct type that names a default member
 *    (`dose: 5 mg` means `dose { amount: 5 mg }`)
 */
export function checkAssignable(
    value: Value,
    ref: TypeRef,
    index: MetamodelIndex,
): TypeMismatch | undefined {
    const expected = describeTypeRef(ref);

    switch (ref.$type) {
        case 'ListTypeRef': {
            if (isListValue(value)) {
                for (const item of value.items) {
                    const mismatch = checkAssignable(item, ref.element, index);
                    if (mismatch) return mismatch;
                }
                return undefined;
            }
            // Scalar-as-one-element-list.
            return checkAssignable(value, ref.element, index);
        }

        case 'EnumTypeRef': {
            if (!isIdentValue(value)) {
                return { expected, actual: describeValue(value) };
            }
            return ref.values.includes(value.value)
                ? undefined
                : { expected, actual: `'${value.value}'` };
        }

        case 'VocabTypeRef':
            // Open vocabulary: any string-ish value is legal by design.
            return (isTextValue(value) || isIdentValue(value))
                ? undefined
                : { expected, actual: describeValue(value) };

        case 'RefTypeRef':
            return (isTextValue(value) || isIdentValue(value))
                ? undefined
                : { expected, actual: describeValue(value) };

        default: {
            const typeName = (ref as { typeName: string }).typeName;
            switch (typeName) {
                case 'Number':
                    return isNumberValue(value) ? undefined : { expected, actual: describeValue(value) };
                case 'Measurement':
                    return isMeasurement(value) ? undefined : { expected, actual: describeValue(value) };
                case 'String':
                case 'Text':
                    return (isTextValue(value) || isIdentValue(value))
                        ? undefined : { expected, actual: describeValue(value) };
                case 'Ident':
                    return isIdentValue(value) ? undefined : { expected, actual: describeValue(value) };
                case 'Bool':
                    return isIdentValue(value) && (value.value === 'true' || value.value === 'false')
                        ? undefined : { expected, actual: describeValue(value) };
                default: {
                    // A struct or entity type written as a scalar — legal only
                    // when the type names a default member that accepts it.
                    const defaultMember = index.defaultMember(typeName);
                    if (defaultMember) {
                        const member = index.member(typeName, defaultMember);
                        if (member) return checkAssignable(value, member.type, index);
                    }
                    if (!index.has(typeName)) {
                        return { expected: `${expected} (unknown type)`, actual: describeValue(value) };
                    }
                    return { expected, actual: describeValue(value) };
                }
            }
        }
    }
}

// ── Suggestions ──────────────────────────────────────────────────────────────

/** Levenshtein distance, capped — only used to power "did you mean" hints. */
function editDistance(a: string, b: string): number {
    const rows = a.length + 1;
    const cols = b.length + 1;
    let previous = Array.from({ length: cols }, (_, i) => i);
    for (let i = 1; i < rows; i++) {
        const current = [i];
        for (let j = 1; j < cols; j++) {
            current[j] = Math.min(
                previous[j] + 1,
                current[j - 1] + 1,
                previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
            );
        }
        previous = current;
    }
    return previous[cols - 1];
}

/**
 * Closest candidate to `input`, or undefined when nothing is close enough.
 * The threshold scales with word length so short names do not match everything.
 */
export function suggest(input: string, candidates: Iterable<string>): string | undefined {
    const threshold = Math.max(2, Math.floor(input.length / 3));
    let best: string | undefined;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (const candidate of candidates) {
        if (candidate === input) return undefined;
        const distance = editDistance(input.toLowerCase(), candidate.toLowerCase());
        if (distance < bestDistance && distance <= threshold) {
            best = candidate;
            bestDistance = distance;
        }
    }
    return best;
}

/** Entities declared anywhere in the document, including nested ones. */
export function allEntities(model: Model): EntityDecl[] {
    const result: EntityDecl[] = [];
    for (const node of AstUtils.streamAllContents(model)) {
        if (isEntityDecl(node)) result.push(node);
    }
    for (const decl of model.declarations) {
        if (isEntityDecl(decl) && !result.includes(decl)) result.push(decl);
    }
    return result;
}
