/**
 * CompilerIR v2 — the shared data contract between the visual builder, the
 * compiler (SQLite persistence) and the AI agent tools.
 *
 * Browser-safe: no Node.js imports.
 *
 * WHY THIS IS GENERIC
 * v1 exposed one typed array per builtin kind (substances[], interventions[],
 * ...). That shape cannot represent a user-defined type, so it privileged the
 * builtins in the data contract — the same second-tier asymmetry the UI layer
 * rejected. v2 carries the resolved metamodel (`types`) alongside uniform
 * `entities`, so `substance` and a user's `training` are indistinguishable to
 * every consumer.
 *
 * Helpers at the bottom (entitiesOfType / entitiesWithTrait / prop accessors)
 * exist so consumers stay readable without reintroducing typed projections.
 */

// ── Values ───────────────────────────────────────────────────────────────────

export interface MeasurementIR {
    amount: number;
    /** Plain unit string, e.g. "mg", "ml", "days", "mg/kg" */
    unit: string;
}

/** Any value expressible in the DSL, tagged for exhaustive switching. */
export type ValueIR =
    | { kind: 'measurement'; value: MeasurementIR }
    | { kind: 'number'; value: number }
    | { kind: 'text'; value: string }
    | { kind: 'ident'; value: string }
    | { kind: 'list'; items: ValueIR[] }
    | { kind: 'struct'; fields: Record<string, ValueIR> };

// ── Metamodel ────────────────────────────────────────────────────────────────

export type TypeRefIR =
    /** A primitive (Number, String, Text, Bool, Ident, Measurement) or struct type. */
    | { kind: 'named'; name: string }
    | { kind: 'list'; element: TypeRefIR }
    | { kind: 'enum'; values: string[] }
    /** Open vocabulary — free strings drawn from a named domain. */
    | { kind: 'vocab'; domain: string }
    /** Resolved reference to an entity of this type or any subtype. */
    | { kind: 'ref'; target: string };

export interface AnnotationIR {
    name: string;
    args: Array<string | number>;
}

export interface MemberIR {
    name: string;
    optional: boolean;
    type: TypeRefIR;
    default?: ValueIR;
    annotations: AnnotationIR[];
}

export interface TypeIR {
    name: string;
    /** Direct supertype name, if declared. */
    extends?: string;
    /** Traits declared on this type only — see `resolveTraits` for the closure. */
    traits: string[];
    members: MemberIR[];
    annotations: AnnotationIR[];
}

/** The closed, host-owned trait vocabulary. Structure is open; semantics is not. */
export const KNOWN_TRAITS = ['pharmacokinetic', 'interacting', 'schedulable'] as const;
export type Trait = typeof KNOWN_TRAITS[number];

// ── Entities ─────────────────────────────────────────────────────────────────

/** A `use` reference with optional overrides, typed against the referenced entity. */
export interface UseIR {
    targetType: string;
    targetName: string;
    overrides: Record<string, ValueIR>;
    /**
     * Position among the declaring entity's assignments. `uses` and `children`
     * are separate arrays, so without this their relative source order — the
     * interleaving of `use intervention "A"` and an inline `intervention "B"` —
     * would be lost. Consumers that render items in written order should merge
     * the two arrays and sort on this. Optional: absent means unknown, which
     * consumers should treat as 0 rather than as a distinct state.
     */
    order?: number;
}

export interface EntityIR {
    /**
     * Stable identity, `${type}:${name}` — also the graph-layout key. Replaces
     * v1's array-index node IDs, under which inserting a declaration mid-file
     * silently reattached saved canvas positions to the wrong entities.
     */
    id: string;
    type: string;
    name: string;
    /** Entity-level `extends` target name, if declared. */
    extends?: string;
    /** Full trait closure, including traits inherited through the type chain. */
    traits: string[];
    props: Record<string, ValueIR>;
    /**
     * Claim-level evidence from `@evidence("PMID:…")` annotations:
     * assignment name → sources. Absent when nothing is cited. Declaration-
     * level JSDoc `@evidence` tags stay in the documentation layer (hover)
     * and are deliberately NOT harvested here — this is the machine-readable
     * claim→source map the graph renders.
     */
    evidence?: Record<string, EvidenceRef[]>;
    /** Entities declared inline in this one's body. */
    children: EntityIR[];
    uses: UseIR[];
    /**
     * Position among the parent's assignments; see UseIR.order. 0 at top level.
     */
    order?: number;
    /**
     * Provenance: 'entry' when declared in the compiled document, 'import'
     * when it came from an imported file. Absent for IR built without a
     * compiler pass (AI-normalized IR) — consumers treat that as entry, i.e.
     * everything is the protocol. Drives the graph's relevance filter.
     */
    origin?: 'entry' | 'import';
}

/** A citation in the shared identifier vocabulary (aligned with med-research-mcp). */
export interface EvidenceRef {
    kind: 'PMID' | 'DOI';
    id: string;
}

// ── Interactions ─────────────────────────────────────────────────────────────

export interface InteractionIR {
    /** Unique ID assigned by the compiler, e.g. "ix-0", "ix-1" */
    id: string;
    /** "positive" for synergies, "negative" for conflicts */
    relType: 'positive' | 'negative';
    /** The two interacting entities, sorted alphabetically for canonical ordering */
    entities: [string, string];
    weight?: 'low' | 'medium' | 'high';
    note?: string;
    source?: string;
}

// ── Top-level container ──────────────────────────────────────────────────────

export interface CompilerIR {
    /** Schema version. 1 was the typed-projection shape; 2 is generic. */
    version: 2;
    types: TypeIR[];
    entities: EntityIR[];
    interactions: InteractionIR[];
}

export function emptyIR(): CompilerIR {
    return { version: 2, types: [], entities: [], interactions: [] };
}

// ── Query helpers ────────────────────────────────────────────────────────────

/** Stable entity identity. Keep in one place — the graph layout depends on it. */
export function entityId(type: string, name: string): string {
    return `${type}:${name}`;
}

/** Names of `type` and every type it transitively extends. */
export function typeChain(ir: CompilerIR, typeName: string): string[] {
    const chain: string[] = [];
    const seen = new Set<string>();
    let current: string | undefined = typeName;
    while (current && !seen.has(current)) {
        seen.add(current);
        chain.push(current);
        current = ir.types.find(t => t.name === current)?.extends;
    }
    return chain;
}

/** True when `typeName` is `ancestor` or extends it — the subtype rule for Ref<>. */
export function isSubtypeOf(ir: CompilerIR, typeName: string, ancestor: string): boolean {
    return typeChain(ir, typeName).includes(ancestor);
}

/**
 * Full trait closure for a type name — what `EntityIR.traits` must hold.
 *
 * `traits` is derived state: a type inheriting from `substance` inherits
 * `pharmacokinetic` and `interacting` with it. Anything that builds entities
 * outside the translator (the AI edit path, importers) should recompute it
 * through here rather than carrying over whatever it was handed, since traits
 * decide pharmacokinetic decay, interaction extraction and timeline placement.
 */
export function traitsOfType(ir: CompilerIR, typeName: string): string[] {
    const traits = new Set<string>();
    for (const name of typeChain(ir, typeName)) {
        ir.types.find(t => t.name === name)?.traits.forEach(trait => traits.add(trait));
    }
    return [...traits].sort();
}

/** Entities of `typeName` INCLUDING subtypes, per the identity/substitutability rule. */
export function entitiesOfType(ir: CompilerIR, typeName: string): EntityIR[] {
    return ir.entities.filter(e => isSubtypeOf(ir, e.type, typeName));
}

/**
 * Resolves a member declaration by name, walking `typeName`'s type chain so an
 * inherited member (e.g. `status` declared on `protocol`, requested for a
 * user's `type cycle extends protocol`) is found too. Undefined when no type
 * in the chain declares it.
 */
export function memberOf(ir: CompilerIR, typeName: string, memberName: string): MemberIR | undefined {
    for (const name of typeChain(ir, typeName)) {
        const member = ir.types.find(t => t.name === name)?.members.find(m => m.name === memberName);
        if (member) return member;
    }
    return undefined;
}

export function entitiesWithTrait(ir: CompilerIR, trait: Trait | string): EntityIR[] {
    return ir.entities.filter(e => e.traits.includes(trait));
}

export function hasTrait(entity: EntityIR, trait: Trait | string): boolean {
    return entity.traits.includes(trait);
}

// ── Typed property accessors ─────────────────────────────────────────────────
// Consumers should read props through these rather than switching on `kind`
// inline, so a shape change lands in one place.

export function measurementProp(entity: EntityIR, key: string): MeasurementIR | undefined {
    const value = entity.props[key];
    return value?.kind === 'measurement' ? value.value : undefined;
}

export function textProp(entity: EntityIR, key: string): string | undefined {
    const value = entity.props[key];
    if (value?.kind === 'text' || value?.kind === 'ident') return value.value;
    return undefined;
}

export function numberProp(entity: EntityIR, key: string): number | undefined {
    const value = entity.props[key];
    return value?.kind === 'number' ? value.value : undefined;
}

/**
 * String list for a member. Accepts a bare scalar as a one-element list, which
 * is what keeps `tracks: "ALT"` working alongside `tracks: ["ALT", "AST"]`.
 */
export function stringListProp(entity: EntityIR, key: string): string[] {
    const value = entity.props[key];
    if (!value) return [];
    if (value.kind === 'text' || value.kind === 'ident') return [value.value];
    if (value.kind !== 'list') return [];
    return value.items.flatMap(item =>
        item.kind === 'text' || item.kind === 'ident' ? [item.value] : [],
    );
}

/** A struct-valued member's fields, e.g. `dose { min: 5 mg }`. */
export function structProp(entity: EntityIR, key: string): Record<string, ValueIR> | undefined {
    const value = entity.props[key];
    if (value?.kind === 'struct') return value.fields;
    // `dose: 5 mg` is shorthand for `dose { amount: 5 mg }` — the default-member
    // rule. Surface it as a struct so callers need not special-case shorthand.
    if (value?.kind === 'measurement') return { amount: value };
    return undefined;
}

export function structMeasurement(
    fields: Record<string, ValueIR> | undefined,
    key: string,
): MeasurementIR | undefined {
    const value = fields?.[key];
    return value?.kind === 'measurement' ? value.value : undefined;
}
