/**
 * Validation for the Biohacking DSL.
 *
 * TWO LAYERS, deliberately separated:
 *
 * 1. STRUCTURAL — type checking against the metamodel. Unknown members, wrong
 *    value types, missing required members, enum membership. This layer is
 *    entirely generic: it treats `substance` and a user's `training` alike, and
 *    it is what replaced the parser rules deleted in the migration. Before the
 *    metamodel existed, a typo like `half_lfe:` was a parse error; now it is a
 *    validation error with a did-you-mean hint.
 *
 * 2. SEMANTIC — pharmacology that cannot be expressed as data, dispatched on
 *    TRAITS rather than type names. `pharmacokinetic` gates dose-vs-max;
 *    `interacting` gates the conflict/synergy graph. A user writing
 *    `type peptide extends substance` inherits both and gets these checks free,
 *    while `type training` opts out by declaring no traits.
 *
 * Two checks from the pre-metamodel validator are GONE because the metamodel
 * subsumes them: time_of_day and protocol status vocabularies are now `oneof`
 * types in builtin/core.bio, enforced by checkValueTypes below.
 */
import type { ValidationAcceptor, ValidationChecks } from 'langium';
import { AstUtils } from 'langium';
import type {
    EntityDecl,
    Model,
    ScalarAssignment,
    StructAssignment,
    TypeDecl,
    Use,
} from './generated/ast.js';
import {
    isEntityDecl,
    isScalarAssignment,
    isStructAssignment,
    isUse,
} from './generated/ast.js';
import type { BiohackingAstType } from './generated/ast.js';
import type { BiohackingServices } from './biohacking-module.js';
import { InteractionCatalog, entriesFromModel } from './data/interaction-catalog.js';
import type { InteractionEntry } from './data/interaction-catalog.js';
import { isBuiltinUri } from './utils/std-lib.js';
import {
    collectMeasurements,
    findUserWeight,
    parseEvidenceRef,
    perKgDenominator,
} from './utils/evidence-utils.js';
import {
    COLOR_VOCAB,
    KNOWN_TRAITS,
    MetamodelIndex,
    checkAssignable,
    describeTypeRef,
    extendsCycleOf,
    hasTraitDecl,
    isPrimitiveType,
    isSubtypeOfDecl,
    membersOf,
    suggest,
} from './metamodel/model-index.js';
import { typirOwns } from './typir/biohacking-type-system.js';

// ---------------------------------------------------------------------------
// Unit conversion (mass units) — host semantics, cannot live in the library
// ---------------------------------------------------------------------------

const MASS_TO_MCG: Record<string, number> = {
    'mcg': 1,
    'μg': 1,
    'mg': 1_000,
    'g': 1_000_000,
    'kg': 1_000_000_000,
    'ng': 0.001,
};

interface SimpleMeasurement {
    amount: number;
    unit: string;
}

function toMicrograms(m: SimpleMeasurement): number | undefined {
    const factor = MASS_TO_MCG[m.unit.toLowerCase()];
    return factor === undefined ? undefined : m.amount * factor;
}

/**
 * The two amounts to compare for a dose-vs-max_dose check, or undefined when
 * the pair is not comparable at all.
 *
 * Mass units convert through toMicrograms first, so `900 mg` vs `0.4 g`
 * compares correctly. Everything else (IU, mg/kg, %, ng/mL, and any unit a
 * user's own types introduce) has no conversion table and never will — the
 * host cannot know every dimension a `.bio` author might invent. Rather than
 * skip those pairs entirely, fall back to a literal same-unit match: if both
 * sides wrote the exact same unit string, their amounts are directly
 * comparable without a factor. Mismatched non-mass units (mg vs IU, mg vs
 * mg/kg) are different dimensions, not a violation, so they stay skipped.
 */
function comparable(dose: SimpleMeasurement, maxDose: SimpleMeasurement): [number, number] | undefined {
    const doseMcg = toMicrograms(dose);
    const maxMcg = toMicrograms(maxDose);
    if (doseMcg !== undefined && maxMcg !== undefined) return [doseMcg, maxMcg];

    if (dose.unit.toLowerCase() === maxDose.unit.toLowerCase()) return [dose.amount, maxDose.amount];

    return undefined;
}

// ---------------------------------------------------------------------------
// Value readers — the AST is generic, so these replace the old per-property
// accessor functions (substanceTargets, getMaxDose, ...).
// ---------------------------------------------------------------------------

function scalarAssignments(entity: EntityDecl | Use): Array<{ name: string; value: any }> {
    const assignments = isUse(entity) ? entity.overrides : entity.assignments;
    return assignments.filter(isScalarAssignment).map(a => ({ name: a.name, value: a.value }));
}

function readStringList(entity: EntityDecl, member: string): string[] {
    const assignment = scalarAssignments(entity).find(a => a.name === member);
    if (!assignment) return [];
    const value = assignment.value;
    const unwrap = (v: any): string[] =>
        v?.$type === 'TextValue' || v?.$type === 'IdentValue' ? [String(v.value)] : [];
    if (value.$type === 'ListValue') return value.items.flatMap(unwrap);
    return unwrap(value);
}

function readMeasurement(entity: EntityDecl, member: string): SimpleMeasurement | undefined {
    const assignment = scalarAssignments(entity).find(a => a.name === member);
    const value = assignment?.value;
    if (value?.$type === 'Measurement') {
        return { amount: value.amount, unit: value.unit.unit.join('/') };
    }
    return undefined;
}

/**
 * The effective dose of an entity: `dose: 5 mg` shorthand, or the `amount` /
 * `max` field of a `dose { ... }` block, in that order of preference.
 */
function readDose(entity: EntityDecl): SimpleMeasurement | undefined {
    const direct = readMeasurement(entity, 'dose');
    if (direct) return direct;

    const struct = entity.assignments.filter(isStructAssignment).find(a => a.name === 'dose');
    if (!struct) return undefined;
    for (const key of ['amount', 'max']) {
        const field = struct.fields.filter(isScalarAssignment).find(f => f.name === key);
        const value = field?.value as any;
        if (value?.$type === 'Measurement') {
            return { amount: value.amount, unit: value.unit.unit.join('/') };
        }
    }
    return undefined;
}

function unique(values: string[]): string[] {
    return [...new Set(values)];
}

/** Entity that a `use` points at, when the reference resolves. */
function useTarget(use: Use): EntityDecl | undefined {
    return use.target?.ref;
}

/**
 * Every entity reachable from a container: the entities it declares inline and
 * the entities its `use` statements resolve to. Replaces collectStackEntries,
 * which special-cased Stack/Intervention/Substance.
 */
function containedEntities(entity: EntityDecl): EntityDecl[] {
    const result: EntityDecl[] = [];
    for (const assignment of entity.assignments) {
        if (isEntityDecl(assignment)) {
            result.push(assignment);
        } else if (isUse(assignment)) {
            const target = useTarget(assignment);
            if (target) result.push(target);
        }
    }
    return result;
}

// ---------------------------------------------------------------------------
// Marker entries — the v2 replacement for collectStackEntries
// ---------------------------------------------------------------------------

/**
 * One item inside a container, with its markers folded in.
 *
 * "Folded" matters: a stack contains an intervention, which `use`s a substance,
 * and it is the SUBSTANCE that declares the conflicts. Comparing only what the
 * intervention itself declares misses every interaction in practice, since the
 * pharmacology lives one hop down.
 */
interface MarkerEntry {
    node: EntityDecl | Use;
    name: string;
    targets: string[];
    conflicts: string[];
    synergies: string[];
    /** Names of the pharmacokinetic entities folded in, for synergy matching. */
    sourceNames: string[];
}

/** Pharmacokinetic entities an entity draws on: inline children and `use` targets. */
function pharmacokineticSources(entity: EntityDecl, index?: MetamodelIndex): EntityDecl[] {
    const result: EntityDecl[] = [];
    for (const assignment of entity.assignments) {
        const candidate = isEntityDecl(assignment) ? assignment
            : isUse(assignment) ? useTarget(assignment)
                : undefined;
        const type = candidate?.type?.ref;
        if (candidate && type && hasTraitDecl(type, 'pharmacokinetic', index)) {
            result.push(candidate);
        }
    }
    return result;
}

function markerEntry(entity: EntityDecl, node: EntityDecl | Use, index?: MetamodelIndex): MarkerEntry {
    const sources = pharmacokineticSources(entity, index);
    const fold = (key: string) => unique([
        ...sources.flatMap(s => readStringList(s, key)),
        ...readStringList(entity, key),
    ]);
    return {
        node,
        name: entity.name,
        targets: fold('targets'),
        conflicts: fold('conflicts'),
        synergies: fold('synergies'),
        sourceNames: sources.map(s => s.name),
    };
}

/** Items directly inside a container, each with folded markers. */
function collectMarkerEntries(container: EntityDecl, index?: MetamodelIndex): MarkerEntry[] {
    const entries: MarkerEntry[] = [];
    for (const assignment of container.assignments) {
        if (isEntityDecl(assignment)) {
            entries.push(markerEntry(assignment, assignment, index));
        } else if (isUse(assignment)) {
            const target = useTarget(assignment);
            if (target) entries.push(markerEntry(target, assignment, index));
        }
    }
    return entries;
}

/**
 * Diagnostic location for an entry. Built per-branch rather than by returning
 * a property name, because the valid properties differ between Use and
 * EntityDecl and a union loses that.
 */
function at(node: EntityDecl | Use): any {
    return isUse(node)
        ? { node, property: 'target' }
        : { node, property: 'name' };
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

export function registerValidationChecks(services: BiohackingServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.BiohackingValidator;
    const checks: ValidationChecks<BiohackingAstType> = {
        TypeDecl: [
            validator.checkTraitVocabulary.bind(validator),
            validator.checkTypeExtendsCycle.bind(validator),
            validator.checkDuplicateMembers.bind(validator),
            validator.checkMemberTypesResolve.bind(validator),
            validator.checkColorVocabulary.bind(validator),
        ],
        EntityDecl: [
            validator.checkUnknownMembers.bind(validator),
            validator.checkValueTypes.bind(validator),
            validator.checkRequiredMembers.bind(validator),
            validator.checkEntityExtendsCycle.bind(validator),
            validator.checkEntityExtendsResolves.bind(validator),
            validator.checkDoseExceedsMax.bind(validator),
            validator.checkConflictingContents.bind(validator),
            validator.checkKnownInteractions.bind(validator),
            validator.checkTargetOverlap.bind(validator),
            validator.checkCrossMarkerConflicts.bind(validator),
            validator.checkMissingSynergies.bind(validator),
            validator.checkUseCycles.bind(validator),
            validator.checkPerKgWithoutWeight.bind(validator),
        ],
        ScalarAssignment: [
            validator.checkEvidenceAnnotations.bind(validator),
        ],
        StructAssignment: [
            validator.checkEvidenceAnnotations.bind(validator),
        ],
        // `Use` target conformance moved to the Typir layer: `use substance "X"`
        // is a subtyping question, and the `extends` chain is modelled there as
        // real class subtyping rather than a hand-rolled walk.
        Model: [
            validator.checkDuplicateIdentities.bind(validator),
            validator.checkInlineEntityShadowing.bind(validator),
        ],
    };
    registry.register(checks, validator);
}

// ---------------------------------------------------------------------------
// Validator
// ---------------------------------------------------------------------------

export class BiohackingValidator {

    /**
     * Held only to reach the builtin documents when building the interaction
     * catalog; nothing here touches the services during construction, so the
     * DI proxy is safe to keep.
     */
    constructor(private readonly services?: BiohackingServices) { }

    /** The builtin catalog, parsed once — builtin/ documents never change. */
    private builtinCatalog?: InteractionEntry[];

    /**
     * Builds a name-lookup index for a node.
     *
     * Seeded with the node's own document PLUS the document containing its
     * resolved type. That second part matters: `substance` is declared in
     * builtin/core.bio, so an index built from the user's file alone would not
     * know about `Dose` or any other type core.bio declares. Cross-document
     * resolution comes from the linker (see chainOf/membersOf); this index only
     * backs name-based lookups such as did-you-mean suggestions.
     */
    private index(node: EntityDecl | TypeDecl | Use | Model): MetamodelIndex | undefined {
        const own = AstUtils.getContainerOfType(node, (n): n is Model => n.$type === 'Model');
        if (!own) return undefined;

        const resolved = isEntityDecl(node) ? node.type?.ref
            : isUse(node) ? node.type?.ref
                : undefined;
        const typeModel = resolved
            ? AstUtils.getContainerOfType(resolved, (n): n is Model => n.$type === 'Model')
            : undefined;

        const extra = typeModel && typeModel !== own
            ? typeModel.declarations.filter((d): d is TypeDecl => d.$type === 'TypeDecl')
            : [];
        return new MetamodelIndex(own, extra);
    }

    // ── Type-declaration checks ──────────────────────────────────────────────

    /**
     * Traits are a closed vocabulary owned by the host: each one corresponds to
     * validator code below. An unknown trait is a warning rather than an error
     * so a file authored against a newer build still loads.
     */
    checkTraitVocabulary(type: TypeDecl, accept: ValidationAcceptor): void {
        type.traits.forEach((trait, i) => {
            if ((KNOWN_TRAITS as readonly string[]).includes(trait)) return;
            const hint = suggest(trait, KNOWN_TRAITS);
            accept('warning',
                `Unknown trait '${trait}'.${hint ? ` Did you mean '${hint}'?` : ''} ` +
                `Known traits: ${KNOWN_TRAITS.join(', ')}.`,
                { node: type, property: 'traits', index: i });
        });
    }

    /**
     * `@color(...)` is a closed, host-owned vocabulary — the render layer's
     * palette slots, not arbitrary CSS. Unknown values are a warning rather
     * than an error, same reasoning as checkTraitVocabulary: a file authored
     * against a newer build should still load. `@icon` is deliberately NOT
     * validated this way — codicon names are the UI layer's 600+-entry
     * vocabulary and a bad one simply renders no icon.
     */
    checkColorVocabulary(type: TypeDecl, accept: ValidationAcceptor): void {
        type.annotations.forEach((annotation, i) => {
            if (annotation.name !== 'color') return;
            const value = annotation.args[0]?.stringValue ?? annotation.args[0]?.identValue;
            if (value === undefined) return;
            if ((COLOR_VOCAB as readonly string[]).includes(value)) return;

            const hint = suggest(value, COLOR_VOCAB);
            accept('warning',
                `Unknown color '${value}'.${hint ? ` Did you mean '${hint}'?` : ''} ` +
                `Valid colors: ${COLOR_VOCAB.join(', ')}.`,
                { node: type, property: 'annotations', index: i });
        });
    }

    /**
     * Claim-level evidence annotations (`dose: 400mcg @evidence("PMID:4110897")`).
     * The argument must be a string in the shared identifier vocabulary
     * (PMID:<digits> or DOI:10.<digits>/<suffix> — the same ids the
     * med-research-mcp toolchain fetches). Warning, not error: a file
     * authored against a newer build must still load.
     */
    checkEvidenceAnnotations(node: ScalarAssignment | StructAssignment, accept: ValidationAcceptor): void {
        node.annotations.forEach((annotation, i) => {
            if (annotation.name !== 'evidence') return;
            const arg = annotation.args[0]?.stringValue;
            if (arg === undefined) {
                accept('warning',
                    `@evidence requires a string argument, e.g. @evidence("PMID:4110897").`,
                    { node, property: 'annotations', index: i });
                return;
            }
            if (!parseEvidenceRef(arg)) {
                accept('warning',
                    `Unrecognized evidence reference '${arg}' — expected PMID:<id> or DOI:<doi>.`,
                    { node, property: 'annotations', index: i });
            }
        });
    }

    /**
     * Body-weight-relative doses (`2 g/kg`, `100 mg/lb`) are dead weight
     * without a weight to resolve against. Warn when a per-kg measurement
     * exists but no `user` entity with a `weight` member is in the workspace.
     */
    checkPerKgWithoutWeight(entity: EntityDecl, accept: ValidationAcceptor): void {
        const perKg = collectMeasurements(entity).filter(m => perKgDenominator(m.unit.unit) !== undefined);
        if (perKg.length === 0) return;
        if (this.services && findUserWeight(this.services)) return;
        const unit = perKg[0].unit.unit.join('/');
        accept('warning',
            `Body-weight-relative dose (${unit}) but no user weight in the workspace — ` +
            `add e.g. user "You" { weight: 82 kg } so doses can resolve.`,
            { node: perKg[0] });
    }

    checkTypeExtendsCycle(type: TypeDecl, accept: ValidationAcceptor): void {
        const cycle = extendsCycleOf(type, this.index(type));
        if (cycle) {
            accept('error', `Cycle detected in type extension: ${cycle}.`,
                { node: type, property: 'superType' });
        }
    }

    checkDuplicateMembers(type: TypeDecl, accept: ValidationAcceptor): void {
        const seen = new Set<string>();
        type.members.forEach((member, i) => {
            if (seen.has(member.name)) {
                accept('error', `Duplicate member '${member.name}' on type '${type.name}'.`,
                    { node: type, property: 'members', index: i });
            }
            seen.add(member.name);
        });
    }

    /** A member typed as something neither primitive nor declared is a typo. */
    checkMemberTypesResolve(type: TypeDecl, accept: ValidationAcceptor): void {
        const index = this.index(type);
        if (!index) return;

        type.members.forEach((member, i) => {
            let ref: any = member.type;
            while (ref?.$type === 'ListTypeRef') ref = ref.element;
            if (ref?.$type !== 'NamedTypeRef') return;

            const name = ref.typeName;
            if (isPrimitiveType(name) || index.has(name)) return;

            const hint = suggest(name, [...index.allTypeNames(), 'Number', 'String', 'Text', 'Bool', 'Ident', 'Measurement']);
            accept('error',
                `Unknown type '${name}' for member '${member.name}'.${hint ? ` Did you mean '${hint}'?` : ''}`,
                { node: type, property: 'members', index: i });
        });
    }

    // ── Entity structural checks ─────────────────────────────────────────────

    /**
     * The check that replaced the parser. Every assignment must name a member
     * declared on the entity's type or one of its supertypes.
     */
    checkUnknownMembers(entity: EntityDecl, accept: ValidationAcceptor): void {
        const type = entity.type?.ref;
        if (!type) return;
        const index = this.index(entity);
        const typeName = type.name;

        const members = membersOf(type, index);
        entity.assignments.forEach((assignment, i) => {
            if (!isScalarAssignment(assignment) && !isStructAssignment(assignment)) return;
            if (members.has(assignment.name)) return;

            const hint = suggest(assignment.name, members.keys());
            accept('error',
                `Unknown property '${assignment.name}' on type '${typeName}'.` +
                (hint ? ` Did you mean '${hint}'?` : ''),
                { node: entity, property: 'assignments', index: i });
        });
    }

    /**
     * The VALUE-DEPENDENT half of value checking: `[T]`, `oneof(...)`,
     * `Vocab<d>` and `Ref<T>`, all of which are decided by a value's literal
     * text rather than by a type graph. Members declared with a plain named
     * type are skipped here because Typir owns them — see `typirOwns` in
     * typir/biohacking-type-system.ts, which is the single definition of the
     * boundary. The two sets must stay disjoint or a mismatch is reported
     * twice.
     */
    checkValueTypes(entity: EntityDecl, accept: ValidationAcceptor): void {
        const type = entity.type?.ref;
        if (!type) return;
        const index = this.index(entity)!;
        const members = membersOf(type, index);

        entity.assignments.forEach((assignment, i) => {
            if (!isScalarAssignment(assignment)) return;
            const member = members.get(assignment.name);
            if (!member) return; // already reported by checkUnknownMembers
            if (typirOwns(member.type)) return; // reported by the Typir layer

            const mismatch = checkAssignable(assignment.value, member.type, index);
            if (mismatch) {
                accept('error',
                    `Property '${assignment.name}' expects ${mismatch.expected}, but got ${mismatch.actual}.`,
                    { node: entity, property: 'assignments', index: i });
            }
        });
    }

    checkRequiredMembers(entity: EntityDecl, accept: ValidationAcceptor): void {
        const type = entity.type?.ref;
        if (!type) return;
        const index = this.index(entity);
        const typeName = type.name;

        // An entity that extends another inherits its values, so requiredness
        // cannot be judged from this declaration alone.
        if (entity.superType) return;

        const provided = new Set(
            entity.assignments.flatMap(a =>
                isScalarAssignment(a) || isStructAssignment(a) ? [a.name] : []),
        );

        const missing: string[] = [];
        for (const [name, member] of membersOf(type, index)) {
            if (member.optional || member.default) continue;
            // List and vocabulary members default to empty rather than missing.
            if (member.type.$type === 'ListTypeRef') continue;
            if (!provided.has(name)) missing.push(name);
        }

        if (missing.length > 0) {
            accept('warning',
                `Type '${typeName}' declares required ${missing.length === 1 ? 'property' : 'properties'} ` +
                `not set here: ${missing.join(', ')}.`,
                { node: entity, property: 'name' });
        }
    }

    checkEntityExtendsCycle(entity: EntityDecl, accept: ValidationAcceptor): void {
        const seen = new Set<string>();
        let current: EntityDecl | undefined = entity;
        while (current) {
            if (seen.has(current.name)) {
                accept('error',
                    `Circular extends detected for '${entity.name}'.`,
                    { node: entity, property: 'superType' });
                return;
            }
            seen.add(current.name);
            current = current.superType?.ref;
        }
    }

    /**
     * An entity extending a name that does not exist. Reported as a warning
     * rather than an error because the parent may legitimately live in a file
     * the author has not imported yet — the entity itself is still usable.
     */
    checkEntityExtendsResolves(entity: EntityDecl, accept: ValidationAcceptor): void {
        if (!entity.superType) return;
        if (entity.superType.ref) return;
        accept('warning',
            `Base '${entity.superType.$refText}' could not be resolved. ` +
            `Properties will not be inherited.`,
            { node: entity, property: 'superType' });
    }

    // ── Trait-gated semantic checks ──────────────────────────────────────────

    /**
     * TRAIT: pharmacokinetic.
     * Compares a dose against the max_dose of whatever the entity draws on.
     * Mass units convert through a factor table; any other unit is comparable
     * only when both sides wrote the exact same unit (IU vs IU, % vs %, ...) —
     * see comparable(). Mismatched, non-convertible units (mg vs IU, mg vs
     * mg/kg) are a different dimension, not a violation, so they are skipped
     * rather than reported.
     */
    checkDoseExceedsMax(entity: EntityDecl, accept: ValidationAcceptor): void {
        const index = this.index(entity);
        const typeName = entity.type?.$refText;
        if (!index || !typeName) return;

        const dose = readDose(entity);
        if (!dose) return;

        for (const source of containedEntities(entity)) {
            const sourceType = source.type?.ref;
            if (!sourceType || !hasTraitDecl(sourceType, 'pharmacokinetic', index)) continue;

            const maxDose = readMeasurement(source, 'max_dose');
            if (!maxDose) continue;
            const amounts = comparable(dose, maxDose);
            if (!amounts) continue;
            const [doseAmount, maxAmount] = amounts;

            if (doseAmount > maxAmount) {
                accept('error',
                    `Dose ${dose.amount} ${dose.unit} exceeds max_dose ` +
                    `${maxDose.amount} ${maxDose.unit} of '${source.name}'.`,
                    { node: entity, property: 'assignments' });
            }
        }
    }

    /**
     * TRAIT: interacting.
     * Flags a container whose contents conflict with one another, comparing
     * each entity's declared `conflicts` against the others' names.
     */
    checkConflictingContents(entity: EntityDecl, accept: ValidationAcceptor): void {
        const index = this.index(entity);
        const entries = collectMarkerEntries(entity, index);
        if (entries.length < 2) return;

        for (let i = 0; i < entries.length; i++) {
            for (let j = i + 1; j < entries.length; j++) {
                const a = entries[i];
                const b = entries[j];
                // Compare folded names too: the conflict is usually declared
                // against the substance, not the intervention wrapping it.
                const aNames = [a.name, ...a.sourceNames];
                const bNames = [b.name, ...b.sourceNames];
                const clash = aNames.some(n => b.conflicts.includes(n))
                    || bNames.some(n => a.conflicts.includes(n));
                if (clash) {
                    accept('error',
                        `Drug interaction conflict: "${a.name}" and "${b.name}" are listed as conflicting substances. `
                        + 'Combining them may cause dangerous interactions.',
                        at(b.node));
                }
            }
        }
    }

    /**
     * Two items in the same container aiming at the same marker. Informational —
     * overlapping targets are usually intentional stacking, occasionally
     * accidental doubling up.
     */
    checkTargetOverlap(entity: EntityDecl, accept: ValidationAcceptor): void {
        const entries = collectMarkerEntries(entity, this.index(entity));
        if (entries.length < 2) return;

        const byMarker = new Map<string, MarkerEntry[]>();
        for (const entry of entries) {
            for (const target of entry.targets) {
                const list = byMarker.get(target) ?? [];
                list.push(entry);
                byMarker.set(target, list);
            }
        }

        for (const [marker, matched] of byMarker) {
            if (matched.length < 2) continue;
            for (const entry of matched) {
                accept('info',
                    `Synergy detected: Multiple items in this stack target "${marker}".`,
                    at(entry.node));
            }
        }
    }

    /** One item targets a marker that another item lists as a conflict. */
    checkCrossMarkerConflicts(entity: EntityDecl, accept: ValidationAcceptor): void {
        // Grouping checks apply to CONTAINERS, not to wrappers. An
        // intervention folds in the substance it uses, so its single entry is
        // itself — comparing that against nothing produces noise. A stack's
        // items are separate things, which is the case worth checking.
        if (pharmacokineticSources(entity, this.index(entity)).length > 0) return;
        const entries = collectMarkerEntries(entity, this.index(entity));

        for (const a of entries) {
            for (const b of entries) {
                if (a === b) continue;
                for (const target of a.targets) {
                    if (!b.conflicts.includes(target)) continue;
                    accept('warning',
                        `Potential conflict: "${a.name}" targets "${target}", `
                        + `which is listed as a conflict for "${b.name}".`,
                        at(a.node));
                }
            }
        }
    }

    /** A declared synergy partner that nothing else in the container provides. */
    checkMissingSynergies(entity: EntityDecl, accept: ValidationAcceptor): void {
        // Grouping checks apply to CONTAINERS, not to wrappers. An
        // intervention folds in the substance it uses, so its single entry is
        // itself — comparing that against nothing produces noise. A stack's
        // items are separate things, which is the case worth checking.
        if (pharmacokineticSources(entity, this.index(entity)).length > 0) return;
        const entries = collectMarkerEntries(entity, this.index(entity));

        for (const entry of entries) {
            for (const synergy of entry.synergies) {
                const satisfied = entries.some(other =>
                    other !== entry
                    && (other.targets.includes(synergy)
                        || other.name === synergy
                        || other.sourceNames.includes(synergy)));
                if (satisfied) continue;

                accept('hint',
                    `Synergy suggestion: "${entry.name}" has a known synergy with "${synergy}". `
                    + `Consider adding an intervention that targets "${synergy}" to this stack.`,
                    at(entry.node));
            }
        }
    }

    /**
     * A container that `use`s its way back to itself. Distinct from
     * checkEntityExtendsCycle: that follows `extends`, this follows composition,
     * and an unguarded cycle here makes IR translation recurse forever.
     */
    checkUseCycles(entity: EntityDecl, accept: ValidationAcceptor): void {
        const seen = new Set<EntityDecl>();

        const walk = (current: EntityDecl): boolean => {
            if (current === entity && seen.size > 0) return true;
            if (seen.has(current)) return false;
            seen.add(current);
            for (const assignment of current.assignments) {
                if (!isUse(assignment)) continue;
                const target = useTarget(assignment);
                if (target && walk(target)) return true;
            }
            return false;
        };

        for (const assignment of entity.assignments) {
            if (!isUse(assignment)) continue;
            const target = useTarget(assignment);
            if (target && walk(target)) {
                accept('error',
                    `Cycle detected in stack extension: ${entity.name}`,
                    { node: entity, property: 'name' });
                return;
            }
        }
    }

    /**
     * TRAIT: interacting.
     * Cross-references contents against the curated interaction catalog.
     *
     * The catalog used to be a TypeScript table (data/known-interactions.ts)
     * that duplicated, in a second vocabulary, pairings the marker graph in
     * @std/interactions.bio already described. It is now
     * builtin/interactions.bio — the same `.bio` syntax, read by this check and
     * by the IR validator, and extensible by the user.
     */
    checkKnownInteractions(entity: EntityDecl, accept: ValidationAcceptor): void {
        const index = this.index(entity);
        if (!index) return;

        const contents = containedEntities(entity).filter(e => {
            const type = e.type?.ref;
            return type ? hasTraitDecl(type, 'interacting', index) : false;
        });
        if (contents.length < 2) return;

        const catalog = this.interactionCatalog(entity);
        if (catalog.size === 0) return;

        // Match on folded names, like the marker checks above and like the IR
        // validator: a stack holds interventions, and it is the SUBSTANCE one
        // hop down that the catalog names. Matching only the item's own name
        // missed every pairing written the normal way.
        const namesOf = (e: EntityDecl): string[] =>
            unique([e.name, ...pharmacokineticSources(e, index).map(s => s.name)]);

        for (let i = 0; i < contents.length; i++) {
            for (let j = i + 1; j < contents.length; j++) {
                for (const a of namesOf(contents[i])) {
                    for (const b of namesOf(contents[j])) {
                        const interaction = catalog.find(a, b);
                        if (!interaction) continue;
                        const severity = interaction.severity === 'critical' ? 'error' : 'warning';
                        accept(severity,
                            `Known interaction between '${a}' and '${b}': ${interaction.message}`,
                            { node: entity, property: 'name' });
                    }
                }
            }
        }
    }

    /**
     * The catalog visible from a node: the builtin one plus any `interaction`
     * declared in the same file.
     *
     * Two sources, matching how the two libraries differ (see utils/std-lib.ts):
     * builtin/ is always in scope and unshadowable, so its entries apply
     * everywhere; a user's own declarations are ordinary content and apply where
     * they are written. The builtin half is memoised — it is the same 34 entries
     * for every check on every document.
     */
    private interactionCatalog(node: EntityDecl): InteractionCatalog {
        const own = AstUtils.getContainerOfType(node, (n): n is Model => n.$type === 'Model');
        return new InteractionCatalog([
            ...(own ? entriesFromModel(own) : []),
            ...this.builtinInteractions(),
        ]);
    }

    private builtinInteractions(): InteractionEntry[] {
        if (this.builtinCatalog) return this.builtinCatalog;
        const documents = this.services?.shared.workspace.LangiumDocuments;
        const entries: InteractionEntry[] = [];
        for (const document of documents?.all ?? []) {
            if (!isBuiltinUri(document.uri)) continue;
            const model = document.parseResult?.value;
            if (model?.$type === 'Model') entries.push(...entriesFromModel(model as Model));
        }
        // Not cached when empty: the builtin library may simply not be loaded
        // yet on the first check of a freshly created workspace.
        if (entries.length > 0) this.builtinCatalog = entries;
        return entries;
    }

    // ── Reference checks ─────────────────────────────────────────────────────

    /**
     * `use substance "X"` must point at an entity that actually is a substance —
     * or a subtype of one, since Ref resolution is substitutable.
     */
    checkUseTargetType(use: Use, accept: ValidationAcceptor): void {
        const declared = use.type?.ref;
        const target = useTarget(use);
        const actual = target?.type?.ref;
        if (!declared || !target || !actual) return;

        if (!isSubtypeOfDecl(actual, declared, this.index(use))) {
            accept('error',
                `'${target.name}' is a ${actual.name}, not a ${declared.name}.`,
                { node: use, property: 'target' });
        }
    }

    // ── Document-level checks ────────────────────────────────────────────────

    /**
     * Identity is (root type, name): two entities may share a name only if they
     * sit in unrelated type hierarchies. `substance "X"` and `peptide "X"` are a
     * collision when peptide extends substance, because `Ref<substance>` would
     * then be ambiguous.
     */
    checkDuplicateIdentities(model: Model, accept: ValidationAcceptor): void {
        const index = new MetamodelIndex(model);
        const declared: EntityDecl[] = [];
        for (const node of AstUtils.streamAllContents(model)) {
            if (isEntityDecl(node)) declared.push(node);
        }

        const byName = new Map<string, EntityDecl[]>();
        for (const entity of declared) {
            const list = byName.get(entity.name) ?? [];
            list.push(entity);
            byName.set(entity.name, list);
        }

        for (const [name, entities] of byName) {
            if (entities.length < 2) continue;
            for (let i = 0; i < entities.length; i++) {
                for (let j = i + 1; j < entities.length; j++) {
                    const a = entities[i].type?.ref;
                    const b = entities[j].type?.ref;
                    if (!a || !b) continue;
                    if (isSubtypeOfDecl(a, b, index) || isSubtypeOfDecl(b, a, index)) {
                        accept('error',
                            `Duplicate declaration of '${name}': '${a.name}' and '${b.name}' ` +
                            `are in the same type hierarchy.`,
                            { node: entities[j], property: 'name' });
                    }
                }
            }
        }
    }

    /**
     * An inline entity declaration — `substance "Caffeine"` written inside an
     * `intervention` body via a member like `compounds: [substance]`, rather
     * than as its own top-level declaration — holds a real value, not a
     * reference. Two of them sharing a name have no relationship to each
     * other: unlike `use substance "Caffeine"`, which always points at the
     * SAME entity, each inline declaration is free to set `half_life` (or
     * anything else) to something different, and nothing keeps them in sync.
     * Reported as a warning, not an error, because nothing is structurally
     * wrong — it is a foot-gun the author may not have noticed.
     *
     * Only inline declarations are ever the SUBJECT here. Two top-level
     * declarations sharing a name are checkDuplicateIdentities's problem
     * (type-hierarchy aware, and an error, since that case is genuinely
     * ambiguous for `Ref<T>` resolution). `use` statements are references,
     * not declarations, and are excluded by construction — `isEntityDecl`
     * never matches a `Use` node.
     */
    checkInlineEntityShadowing(model: Model, accept: ValidationAcceptor): void {
        const declared: EntityDecl[] = [];
        for (const node of AstUtils.streamAllContents(model)) {
            if (isEntityDecl(node)) declared.push(node);
        }

        const topLevelNames = new Set(
            declared.filter(e => e.$container === model).map(e => e.name),
        );

        const inline = declared.filter(e => e.$container !== model);
        const inlineByName = new Map<string, EntityDecl[]>();
        for (const entity of inline) {
            const list = inlineByName.get(entity.name) ?? [];
            list.push(entity);
            inlineByName.set(entity.name, list);
        }

        for (const entity of inline) {
            const typeName = entity.type?.ref?.name ?? entity.type?.$refText ?? 'entity';
            const usage = `use ${typeName} "${entity.name}"`;

            if (topLevelNames.has(entity.name)) {
                accept('warning',
                    `Inline ${typeName} "${entity.name}" shadows a top-level declaration — values may diverge. ` +
                    `Consider extracting it to a top-level declaration or using '${usage}'.`,
                    { node: entity, property: 'name' });
                continue;
            }

            // Report once PER OFFENDING NODE, not once per pair: with three
            // inline "Caffeine"s, every one of them gets flagged rather than
            // producing a combinatorial blow-up of pairwise diagnostics.
            const duplicated = (inlineByName.get(entity.name) ?? []).some(other => other !== entity);
            if (duplicated) {
                accept('warning',
                    `Inline ${typeName} "${entity.name}" duplicates another inline declaration ` +
                    `elsewhere in this file — values may diverge. ` +
                    `Consider extracting it to a top-level declaration or using '${usage}'.`,
                    { node: entity, property: 'name' });
            }
        }
    }
}

/** Re-exported so tooling can describe a member's declared type consistently. */
export { describeTypeRef };
