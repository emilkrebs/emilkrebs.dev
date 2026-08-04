/**
 * astToIR — converts a parsed Langium Model to a CompilerIR v2.
 * Browser-safe: no Node.js imports. Works in both extension host and webview.
 *
 * This is a generic walk. It knows nothing about substances, doses or
 * protocols: it turns TypeDecls into TypeIR and EntityDecls into EntityIR,
 * whatever they are named. Two pieces of builtin-specific knowledge remain, and
 * both are keyed on a declaration rather than on a hardcoded name list:
 *  - the `interacting` trait, which drives conflict/synergy symmetry and
 *    interaction extraction;
 *  - the `interaction` type, whose instances are the interaction catalog and
 *    are folded into `ir.interactions` instead of `ir.entities`.
 * A user type opting into the trait, or extending `interaction`, gets the same
 * treatment for free.
 */
import type {
    Annotation,
    Assignment,
    EntityDecl,
    Measurement,
    Model,
    ScalarAssignment,
    StructAssignment,
    TypeDecl,
    TypeRef,
    Use,
    Value,
} from '../generated/ast.js';
import {
    isEntityDecl,
    isListValue,
    isMeasurement,
    isNumberValue,
    isScalarAssignment,
    isStructAssignment,
    isTextValue,
    isTypeDecl,
    isUse,
} from '../generated/ast.js';
import type {
    AnnotationIR,
    CompilerIR,
    EntityIR,
    EvidenceRef,
    InteractionIR,
    MemberIR,
    TypeIR,
    TypeRefIR,
    UseIR,
    ValueIR,
} from '../ir/types.js';
import { entityId } from '../ir/types.js';
import type { InteractionEntry } from '../data/interaction-catalog.js';
import { INTERACTION_TYPE, isCatalogInteraction, severityToWeight } from '../data/interaction-catalog.js';
import { parseEvidenceRef } from '../utils/evidence-utils.js';

// ── Values ───────────────────────────────────────────────────────────────────

function translateMeasurement(m: Measurement): ValueIR {
    return { kind: 'measurement', value: { amount: m.amount, unit: m.unit.unit.join('/') } };
}

/**
 * Strips string delimiters if the value converter has not already done so.
 * Guarded rather than unconditional: double-stripping would silently eat the
 * first and last character of legitimate content.
 */
function unquote(raw: string): string {
    if (raw.length >= 6 && raw.startsWith("'''") && raw.endsWith("'''")) {
        return raw.slice(3, -3);
    }
    if (raw.length >= 2 && ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'")))) {
        return raw.slice(1, -1);
    }
    return raw;
}

function translateValue(value: Value): ValueIR {
    if (isMeasurement(value)) return translateMeasurement(value);
    if (isNumberValue(value)) return { kind: 'number', value: value.value };
    if (isTextValue(value)) return { kind: 'text', value: unquote(value.value) };
    if (isListValue(value)) return { kind: 'list', items: value.items.map(translateValue) };
    // IdentValue — an unquoted identifier such as `group: nootropics`.
    return { kind: 'ident', value: (value as { value: string }).value };
}

// ── Metamodel ────────────────────────────────────────────────────────────────

function translateAnnotations(annotations: Annotation[]): AnnotationIR[] {
    return annotations.map(a => ({
        name: a.name,
        args: a.args.map(arg =>
            arg.stringValue !== undefined ? unquote(arg.stringValue)
                : arg.identValue !== undefined ? arg.identValue
                    : arg.numberValue,
        ).filter((v): v is string | number => v !== undefined),
    }));
}

function translateTypeRef(ref: TypeRef): TypeRefIR {
    switch (ref.$type) {
        case 'ListTypeRef':
            return { kind: 'list', element: translateTypeRef(ref.element) };
        case 'EnumTypeRef':
            return { kind: 'enum', values: [...ref.values] };
        case 'VocabTypeRef':
            return { kind: 'vocab', domain: ref.domain };
        case 'RefTypeRef':
            return { kind: 'ref', target: ref.target.$refText };
        default:
            return { kind: 'named', name: (ref as { typeName: string }).typeName };
    }
}

function translateMember(member: TypeDecl['members'][number]): MemberIR {
    return {
        name: member.name,
        optional: member.optional === true,
        type: translateTypeRef(member.type),
        default: member.default ? translateValue(member.default) : undefined,
        annotations: translateAnnotations(member.annotations),
    };
}

function translateType(decl: TypeDecl): TypeIR {
    return {
        name: decl.name,
        extends: decl.superType?.$refText || undefined,
        traits: [...decl.traits],
        members: decl.members.map(translateMember),
        annotations: translateAnnotations(decl.annotations),
    };
}

/**
 * Full trait closure for a type, walking the `extends` chain. A type inheriting
 * from `substance` inherits `pharmacokinetic` and `interacting` with it, which
 * is what makes `type peptide extends substance` behave correctly without the
 * author restating anything.
 */
function resolveTraits(typeName: string, types: Map<string, TypeIR>): string[] {
    const traits = new Set<string>();
    const seen = new Set<string>();
    let current: string | undefined = typeName;
    while (current && !seen.has(current)) {
        seen.add(current);
        const type = types.get(current);
        if (!type) break;
        for (const trait of type.traits) traits.add(trait);
        current = type.extends;
    }
    return [...traits].sort();
}

// ── Entities ─────────────────────────────────────────────────────────────────

function translateUse(use: Use, order: number): UseIR {
    const overrides: Record<string, ValueIR> = {};
    for (const assignment of use.overrides) {
        if (isScalarAssignment(assignment)) {
            overrides[assignment.name] = translateValue(assignment.value);
        } else if (isStructAssignment(assignment)) {
            overrides[assignment.name] = translateStruct(assignment);
        }
    }
    return {
        targetType: use.type.$refText,
        targetName: unquote(use.target.$refText),
        overrides,
        order,
    };
}

function translateStruct(assignment: Assignment & { fields: Assignment[] }): ValueIR {
    const fields: Record<string, ValueIR> = {};
    for (const field of assignment.fields) {
        if (isScalarAssignment(field)) {
            fields[field.name] = translateValue(field.value);
        } else if (isStructAssignment(field)) {
            fields[field.name] = translateStruct(field);
        }
    }
    return { kind: 'struct', fields };
}

function translateEntity(decl: EntityDecl, types: Map<string, TypeIR>, order = 0, origin: 'entry' | 'import' = 'entry'): EntityIR {
    const props: Record<string, ValueIR> = {};
    const children: EntityIR[] = [];
    const uses: UseIR[] = [];
    const evidence: Record<string, EvidenceRef[]> = {};

    decl.assignments.forEach((assignment, i) => {
        if (isScalarAssignment(assignment)) {
            props[assignment.name] = translateValue(assignment.value);
            const refs = evidenceRefsOf(assignment);
            if (refs.length > 0) evidence[assignment.name] = refs;
        } else if (isStructAssignment(assignment)) {
            props[assignment.name] = translateStruct(assignment);
            const refs = evidenceRefsOf(assignment);
            if (refs.length > 0) evidence[assignment.name] = refs;
        } else if (isEntityDecl(assignment)) {
            children.push(translateEntity(assignment, types, i, origin));
        } else if (isUse(assignment)) {
            uses.push(translateUse(assignment, i));
        }
    });

    const typeName = decl.type.$refText;
    const name = unquote(decl.name);
    return {
        id: entityId(typeName, name),
        type: typeName,
        name,
        extends: decl.superType?.$refText ? unquote(decl.superType.$refText) : undefined,
        traits: resolveTraits(typeName, types),
        props,
        ...(Object.keys(evidence).length > 0 ? { evidence } : {}),
        children,
        uses,
        order,
        origin,
    };
}

/** Claim-level `@evidence("PMID:…")` annotations on an assignment → refs. */
function evidenceRefsOf(assignment: ScalarAssignment | StructAssignment): EvidenceRef[] {
    const refs: EvidenceRef[] = [];
    for (const ann of assignment.annotations) {
        if (ann.name !== 'evidence') continue;
        const arg = ann.args[0]?.stringValue;
        if (arg === undefined) continue; // malformed — the validator warns
        const ref = parseEvidenceRef(arg);
        if (ref) refs.push(ref);
    }
    return refs;
}

// ── Entity-level inheritance ─────────────────────────────────────────────────

/**
 * Applies `substance "Zinc Picolinate" extends "Zinc"` — the child inherits the
 * parent's properties and overrides the ones it restates.
 *
 * Type-level `extends` decides which properties are LEGAL (handled by the
 * metamodel); entity-level `extends` decides what their VALUES are, which is
 * this. Resolved after all entities are collected so a child may precede its
 * parent in the file or come from a different one.
 */
/**
 * Combines a parent's properties with a child's.
 *
 * Scalars OVERRIDE — `max_dose: 30 mg` on the child replaces the parent's.
 * Lists MERGE and deduplicate — a child listing extra `targets` adds to the
 * parent's rather than discarding them, which is what makes `extends` useful
 * for narrowing a substance without restating its whole marker set.
 */
function mergeInherited(
    parent: Record<string, ValueIR>,
    child: Record<string, ValueIR>,
    concatKeys: Set<string>,
): Record<string, ValueIR> {
    const result: Record<string, ValueIR> = { ...parent };

    for (const [key, childValue] of Object.entries(child)) {
        const parentValue = parent[key];

        // `@inherit(concat)` — declared in the library, not hardcoded here, so
        // a user type can opt its own text members into the same behaviour.
        if (concatKeys.has(key)
            && parentValue?.kind === 'text' && childValue.kind === 'text') {
            result[key] = { kind: 'text', value: `${parentValue.value}\n${childValue.value}` };
            continue;
        }

        if (parentValue?.kind === 'list' && childValue.kind === 'list') {
            const seen = new Set<string>();
            const items: ValueIR[] = [];
            for (const item of [...parentValue.items, ...childValue.items]) {
                const identity = item.kind === 'text' || item.kind === 'ident'
                    ? item.value
                    : JSON.stringify(item);
                if (seen.has(identity)) continue;
                seen.add(identity);
                items.push(item);
            }
            result[key] = { kind: 'list', items };
        } else {
            result[key] = childValue;
        }
    }

    return result;
}

/** Member names on a type (and its supertypes) declaring `@inherit(concat)`. */
function concatMembers(typeName: string, types: Map<string, TypeIR>): Set<string> {
    const result = new Set<string>();
    const seen = new Set<string>();
    let current: string | undefined = typeName;
    while (current && !seen.has(current)) {
        seen.add(current);
        const type = types.get(current);
        if (!type) break;
        for (const member of type.members) {
            const inherit = member.annotations.find(a => a.name === 'inherit');
            if (inherit?.args.includes('concat')) result.add(member.name);
        }
        current = type.extends;
    }
    return result;
}

function applyEntityInheritance(entities: EntityIR[], types: Map<string, TypeIR>): void {
    const byId = new Map(entities.map(e => [e.id, e]));

    const resolved = new Set<string>();
    const resolve = (entity: EntityIR, seen: Set<string>): void => {
        if (resolved.has(entity.id)) return;
        if (seen.has(entity.id)) {
            // Cycle — leave properties as written; the validator reports it.
            resolved.add(entity.id);
            return;
        }
        seen.add(entity.id);

        if (entity.extends) {
            // A parent is looked up within the same type hierarchy, matching
            // the identity rule that names are unique per root type.
            const parent = byId.get(entityId(entity.type, entity.extends))
                ?? entities.find(e => e.name === entity.extends);
            if (parent) {
                resolve(parent, seen);
                entity.props = mergeInherited(
                    parent.props, entity.props, concatMembers(entity.type, types),
                );
            }
        }
        resolved.add(entity.id);
    };

    for (const entity of entities) {
        resolve(entity, new Set());
    }
}

// ── Symmetry inference ───────────────────────────────────────────────────────

const SYMMETRIC_MEMBERS = ['synergies', 'conflicts'] as const;

/**
 * Synergies and conflicts are inherently bidirectional: if A declares
 * `conflicts: ["B"]` and B does not list A, the reverse is inferred. Applies to
 * anything carrying the `interacting` trait, so user types opting in behave the
 * same. Sorts and deduplicates for stable IR output.
 */
function inferSymmetry(entities: EntityIR[]): void {
    const interacting = entities.filter(e => e.traits.includes('interacting'));
    const byName = new Map(interacting.map(e => [e.name, e]));

    const listOf = (entity: EntityIR, key: string): string[] => {
        const value = entity.props[key];
        if (value?.kind === 'list') {
            return value.items.flatMap(i => (i.kind === 'text' || i.kind === 'ident') ? [i.value] : []);
        }
        if (value?.kind === 'text' || value?.kind === 'ident') return [value.value];
        return [];
    };

    for (const entity of interacting) {
        for (const key of SYMMETRIC_MEMBERS) {
            for (const targetName of listOf(entity, key)) {
                const target = byName.get(targetName);
                if (!target || target === entity) continue;
                const existing = listOf(target, key);
                if (!existing.includes(entity.name)) {
                    target.props[key] = {
                        kind: 'list',
                        items: [...existing, entity.name].map(v => ({ kind: 'text', value: v })),
                    };
                }
            }
        }
    }

    for (const entity of interacting) {
        for (const key of SYMMETRIC_MEMBERS) {
            if (!entity.props[key]) continue;
            const unique = [...new Set(listOf(entity, key))].sort();
            entity.props[key] = { kind: 'list', items: unique.map(v => ({ kind: 'text', value: v })) };
        }
    }
}

// ── Interaction catalog ──────────────────────────────────────────────────────

/**
 * Turns an `interaction "A + B" { ... }` declaration into an InteractionIR.
 *
 * WHY IT IS NOT AN ENTITY. Every entity in `ir.entities` becomes a node on the
 * builder canvas and a row in the .protocol file. The catalog in
 * builtin/interactions.bio is in scope for every document, so carrying it as
 * entities would put 34 catalog nodes on every user's canvas. It belongs in the
 * interaction graph, which is exactly what `ir.interactions` is — and as a
 * bonus the pairing draws as a real edge when both substances are present.
 *
 * This is the second and last piece of builtin-specific knowledge in this file
 * (the first being the `interacting` trait). It is keyed on the type chain, not
 * on a name match, so `type severe_interaction extends interaction` works too.
 */
function catalogInteraction(entity: EntityIR, id: string): InteractionIR | undefined {
    const entry = entryFromIREntity(entity);
    if (!entry) return undefined;
    const pair: [string, string] = [entry.a, entry.b].sort() as [string, string];
    return {
        id,
        relType: 'negative',
        entities: pair,
        weight: severityToWeight(entry.severity),
        note: entry.message,
        source: entity.name,
    };
}

/** Reads the catalog members off a translated entity, or undefined if incomplete. */
function entryFromIREntity(entity: EntityIR): InteractionEntry | undefined {
    const text = (key: string): string | undefined => {
        const value = entity.props[key];
        return value?.kind === 'text' || value?.kind === 'ident' ? value.value : undefined;
    };
    const a = text('a');
    const b = text('b');
    const message = text('message');
    const severity = text('severity');
    if (!a || !b || !message || !severity) return undefined;
    if (severity !== 'critical' && severity !== 'high' && severity !== 'moderate') return undefined;
    return { name: entity.name, a, b, severity, message };
}

/** True when `typeName` is `ancestor` or extends it, per the collected types. */
function extendsType(typeName: string, ancestor: string, types: Map<string, TypeIR>): boolean {
    const seen = new Set<string>();
    let current: string | undefined = typeName;
    while (current && !seen.has(current)) {
        if (current === ancestor) return true;
        seen.add(current);
        current = types.get(current)?.extends;
    }
    return false;
}

// ── Interaction extraction ───────────────────────────────────────────────────

/**
 * Extracts canonical interactions from every `interacting` entity.
 * Deduplicated by `sorted[0]|sorted[1]|relType`.
 */
export function extractInteractions(entities: EntityIR[]): InteractionIR[] {
    const seen = new Set<string>();
    const interactions: InteractionIR[] = [];
    let idCounter = 0;

    const add = (a: string, b: string, relType: 'positive' | 'negative', source: string): void => {
        const pair: [string, string] = [a, b].sort() as [string, string];
        const key = `${pair[0]}|${pair[1]}|${relType}`;
        if (seen.has(key)) return;
        seen.add(key);
        interactions.push({ id: `ix-${idCounter++}`, relType, entities: pair, source });
    };

    for (const entity of entities) {
        if (!entity.traits.includes('interacting')) continue;
        const source = `${entity.type} ${entity.name}`;
        for (const [key, relType] of [['synergies', 'positive'], ['conflicts', 'negative']] as const) {
            const value = entity.props[key];
            if (value?.kind !== 'list') continue;
            for (const item of value.items) {
                if (item.kind === 'text' || item.kind === 'ident') {
                    add(entity.name, item.value, relType, source);
                }
            }
        }
    }

    return interactions;
}

/**
 * Catalog entries first: a declared pairing carries a severity and a message
 * that the marker graph's derived edge does not, so it wins the pair.
 */
function mergeInteractions(catalog: InteractionIR[], derived: InteractionIR[]): InteractionIR[] {
    const key = (ix: InteractionIR): string => `${ix.entities[0]}|${ix.entities[1]}|${ix.relType}`;
    const claimed = new Set(catalog.map(key));
    return [...catalog, ...derived.filter(ix => !claimed.has(key(ix)))];
}

/**
 * Recomputes `interactions` from the current entities.
 *
 * `interactions` is DERIVED state — the conflict/synergy graph implied by what
 * the entities declare. astToIR computes it once at parse time, which is fine
 * for a file that is never edited afterwards, but the visual builder mutates
 * `conflicts`/`synergies` directly. Without recomputing, an edge added or
 * removed in the builder would not appear on the canvas and, worse, saving
 * would persist the stale array into the .protocol file, silently discarding
 * the edit.
 *
 * Cheap and pure, so callers can treat it as "normalise after any mutation".
 *
 * Catalog entries are carried over untouched. They are not derived from any
 * entity — nothing in `ir.entities` implies them — so recomputing without
 * preserving them would delete the interaction catalog on the first edit.
 */
export function withInteractions(ir: CompilerIR): CompilerIR {
    const all: EntityIR[] = [];
    const walk = (entity: EntityIR): void => {
        all.push(entity);
        entity.children.forEach(walk);
    };
    ir.entities.forEach(walk);
    const catalog = ir.interactions.filter(isCatalogInteraction);
    return { ...ir, interactions: mergeInteractions(catalog, extractInteractions(all)) };
}

// ── Public API ───────────────────────────────────────────────────────────────

/** Types the entry file owns outright — imported instances are not merged. */
const ENTRY_ONLY_TYPES = new Set(['protocol']);

/**
 * Translates a parsed Langium Model to a CompilerIR v2.
 * Pure function — no side effects, no Node.js deps.
 *
 * `importedModels` are the transitively imported documents (see
 * parseBioWithImports); their types and entities are merged so references from
 * the entry model do not dangle. Entry declarations win on name collisions.
 * Imported protocols are excluded: a protocol is the compiled artifact of the
 * entry file itself, not a library definition.
 */
export function astToIR(model: Model, importedModels: Model[] = []): CompilerIR {
    const typeMap = new Map<string, TypeIR>();
    const entityDecls: Array<{ decl: EntityDecl; isEntry: boolean }> = [];

    const collect = (m: Model, isEntry: boolean): void => {
        for (const decl of m.declarations) {
            if (isTypeDecl(decl)) {
                if (isEntry || !typeMap.has(decl.name)) {
                    typeMap.set(decl.name, translateType(decl));
                }
            } else if (isEntityDecl(decl)) {
                entityDecls.push({ decl, isEntry });
            }
        }
    };

    collect(model, true);
    for (const imported of importedModels) {
        collect(imported, false);
    }

    // Types must be fully collected before any entity is translated, since
    // resolveTraits walks the extends chain across files.
    const entities: EntityIR[] = [];
    const catalog: InteractionIR[] = [];
    const byId = new Set<string>();
    const claimedPairs = new Set<string>();
    for (const { decl, isEntry } of entityDecls) {
        const entity = translateEntity(decl, typeMap, 0, isEntry ? 'entry' : 'import');
        if (extendsType(entity.type, INTERACTION_TYPE, typeMap)) {
            // Catalog, not canvas — see catalogInteraction. Deduplicated by pair
            // so the builtin catalog and an imported one cannot double-report.
            const interaction = catalogInteraction(entity, `ix-cat-${catalog.length}`);
            if (interaction) {
                const pair = interaction.entities.join('|');
                if (!claimedPairs.has(pair)) {
                    claimedPairs.add(pair);
                    catalog.push(interaction);
                }
            }
            continue;
        }
        if (!isEntry && ENTRY_ONLY_TYPES.has(entity.type)) continue;
        if (!isEntry && byId.has(entity.id)) continue;
        if (isEntry && byId.has(entity.id)) {
            // Entry wins: replace the imported definition in place.
            const index = entities.findIndex(e => e.id === entity.id);
            if (index >= 0) entities[index] = entity;
            continue;
        }
        byId.add(entity.id);
        entities.push(entity);
    }

    // Inheritance first: a child's inherited conflicts must participate in
    // symmetry inference and interaction extraction like any other.
    applyEntityInheritance(entities, typeMap);
    inferSymmetry(entities);

    return {
        version: 2,
        types: [...typeMap.values()],
        entities,
        interactions: mergeInteractions(catalog, extractInteractions(entities)),
    };
}
