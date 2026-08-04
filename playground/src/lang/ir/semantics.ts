/**
 * Semantic safety checks over the CompilerIR — the visual-builder counterpart
 * of the Langium validator's stack/intervention checks: known dangerous
 * interactions, declared conflicts that co-occur, and doses exceeding a
 * substance's max_dose. Browser-safe: no Node.js imports.
 */

import { catalogFromIR, type InteractionCatalog } from '../data/interaction-catalog.js';
import type { IRDiagnostic } from './validator.js';
import type { CompilerIR, EntityIR, MeasurementIR } from './types.js';
import {
    entitiesOfType,
    entityId,
    hasTrait,
    isSubtypeOf,
    measurementProp,
    structMeasurement,
    structProp,
    stringListProp,
} from './types.js';

// ---------------------------------------------------------------------------
// Unit conversion table (mass units)
// ---------------------------------------------------------------------------

const MASS_TO_MCG: Record<string, number> = {
    'mcg': 1,
    'μg': 1,
    'mg': 1_000,
    'g': 1_000_000,
    'kg': 1_000_000_000,
    'ng': 0.001,
};

function massToMicrograms(m: MeasurementIR): number | undefined {
    const factor = MASS_TO_MCG[m.unit.toLowerCase()];
    return factor === undefined ? undefined : m.amount * factor;
}

// ---------------------------------------------------------------------------
// Co-occurrence entries — one per item resolved inside a stack or phase
// ---------------------------------------------------------------------------

interface CoEntry {
    /** Entity IDs behind this entry; the first is the anchor. */
    paths: string[];
    /** Substance-like entity name when resolvable, otherwise the wrapper's name. */
    name: string;
    /** Conflict markers declared on the entity and/or the substance it uses. */
    conflicts: string[];
    /**
     * Set when the entry was pulled in via a `use` targeting a stack. Pairs
     * sharing an origin are already reported by that stack's own check and are
     * skipped.
     */
    origin?: string;
}

function byIdMap(ir: CompilerIR): Map<string, EntityIR> {
    return new Map(ir.entities.map((e) => [e.id, e]));
}

/**
 * Builds a CoEntry for one resolved item (an inline child or a `use` target).
 * An entity carrying the `pharmacokinetic` trait (a substance or subtype) is
 * itself the risk-relevant unit. Anything else (e.g. an intervention) is
 * resolved by folding in whatever pharmacokinetic entity it `use`s — the v2
 * replacement for v1's single `substanceRef` field.
 */
function entryFromEntity(byId: Map<string, EntityIR>, entity: EntityIR, path: string): CoEntry {
    if (hasTrait(entity, 'pharmacokinetic')) {
        return { paths: [path], name: entity.name, conflicts: stringListProp(entity, 'conflicts') };
    }
    const sub = entity.uses
        .map((u) => byId.get(entityId(u.targetType, u.targetName)))
        .find((target): target is EntityIR => target !== undefined && hasTrait(target, 'pharmacokinetic'));
    if (sub) {
        return {
            paths: [path, sub.id],
            name: sub.name,
            conflicts: [...new Set([...stringListProp(sub, 'conflicts'), ...stringListProp(entity, 'conflicts')])],
        };
    }
    return { paths: [path], name: entity.name, conflicts: stringListProp(entity, 'conflicts') };
}

/**
 * Gathers co-occurrence entries for a stack entity: its inline children plus
 * whatever its `use`s resolve to. A `use` targeting another stack recurses,
 * sharing `visited` with the whole call tree so a cycle back to an
 * already-visited stack is skipped.
 */
function collectStackEntries(ir: CompilerIR, byId: Map<string, EntityIR>, stack: EntityIR, visited: Set<string>): CoEntry[] {
    if (visited.has(stack.id)) return [];
    visited.add(stack.id);

    const entries: CoEntry[] = [];
    for (const child of stack.children) {
        entries.push(entryFromEntity(byId, child, child.id));
    }
    for (const use of stack.uses) {
        const target = byId.get(entityId(use.targetType, use.targetName));
        if (!target) continue;
        if (isSubtypeOf(ir, target.type, 'stack')) {
            entries.push(...collectStackEntries(ir, byId, target, visited)
                .map((e) => ({ ...e, origin: target.id })));
        } else {
            entries.push(entryFromEntity(byId, target, target.id));
        }
    }
    return entries;
}

/**
 * Gathers co-occurrence entries for a phase entity. Unlike a stack, each
 * `use` targeting a nested stack gets a FRESH visited set — sibling items in
 * the same phase referencing the same stack are each resolved in full, only
 * a cycle within one reference's own chain is guarded against.
 */
function collectPhaseEntries(ir: CompilerIR, byId: Map<string, EntityIR>, phase: EntityIR): CoEntry[] {
    const entries: CoEntry[] = [];
    for (const child of phase.children) {
        entries.push(entryFromEntity(byId, child, child.id));
    }
    for (const use of phase.uses) {
        const target = byId.get(entityId(use.targetType, use.targetName));
        if (!target) continue;
        if (isSubtypeOf(ir, target.type, 'stack')) {
            entries.push(...collectStackEntries(ir, byId, target, new Set())
                .map((e) => ({ ...e, origin: target.id })));
        } else {
            entries.push(entryFromEntity(byId, target, target.id));
        }
    }
    return entries;
}

// ---------------------------------------------------------------------------
// Pairwise checks within one co-occurrence group (a stack or a phase)
// ---------------------------------------------------------------------------

function checkGroup(
    entries: CoEntry[],
    containerLabel: string,
    containerPath: string,
    diags: IRDiagnostic[],
    catalog: InteractionCatalog,
): void {
    for (let i = 0; i < entries.length; i++) {
        for (let j = i + 1; j < entries.length; j++) {
            const a = entries[i];
            const b = entries[j];
            if (a.name.toLowerCase() === b.name.toLowerCase()) continue;
            if (a.origin !== undefined && a.origin === b.origin) continue;

            const relatedPaths = [...new Set([...a.paths.slice(1), ...b.paths.slice(1), a.paths[0], containerPath])];

            const known = catalog.find(a.name, b.name);
            if (known) {
                diags.push({
                    severity: known.severity === 'critical' ? 'error' : 'warning',
                    path: b.paths[0],
                    relatedPaths,
                    message: `${containerLabel}: ${known.message}`,
                });
            }

            const declared = a.conflicts.some((c) => c.toLowerCase() === b.name.toLowerCase())
                || b.conflicts.some((c) => c.toLowerCase() === a.name.toLowerCase());
            if (declared) {
                diags.push({
                    severity: 'error',
                    path: b.paths[0],
                    relatedPaths,
                    message: `${containerLabel}: "${a.name}" and "${b.name}" are listed as conflicting substances. `
                        + 'Combining them may cause dangerous interactions.',
                });
            }
        }
    }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

export function validateIRSemantics(ir: CompilerIR): IRDiagnostic[] {
    const diags: IRDiagnostic[] = [];
    const byId = byIdMap(ir);
    // The curated pairings travel with the IR (translator/ast-to-ir.ts folds
    // `interaction` declarations into ir.interactions), so the builder checks
    // the same catalog the editor does — builtin/interactions.bio — rather than
    // a table compiled into this file.
    const catalog = catalogFromIR(ir);

    // Stacks: everything in a stack is taken together.
    for (const stack of entitiesOfType(ir, 'stack')) {
        const entries = collectStackEntries(ir, byId, stack, new Set());
        checkGroup(entries, `Stack "${stack.name}"`, stack.id, diags, catalog);
    }

    // Phases: items in the same phase run concurrently. Phases are declared
    // inline inside a protocol, so they live in `protocol.children`, not in
    // `ir.entities` directly.
    for (const protocol of entitiesOfType(ir, 'protocol')) {
        for (const phase of protocol.children) {
            if (!isSubtypeOf(ir, phase.type, 'phase')) continue;
            const entries = collectPhaseEntries(ir, byId, phase);
            checkGroup(entries, `Phase "${phase.name}" (${protocol.name})`, phase.id, diags, catalog);
        }
    }

    // Dose exceeds the referenced substance's max_dose.
    for (const iv of entitiesOfType(ir, 'intervention')) {
        const subUse = iv.uses
            .map((u) => byId.get(entityId(u.targetType, u.targetName)))
            .find((target): target is EntityIR => target !== undefined && hasTrait(target, 'pharmacokinetic'));
        if (!subUse) continue;
        const maxDose = measurementProp(subUse, 'max_dose');
        if (!maxDose) continue;

        const doseFields = structProp(iv, 'dose');
        const dose = structMeasurement(doseFields, 'amount') ?? structMeasurement(doseFields, 'max');
        if (!dose) continue;
        const doseMcg = massToMicrograms(dose);
        const maxMcg = massToMicrograms(maxDose);
        if (doseMcg === undefined || maxMcg === undefined) continue;

        if (doseMcg > maxMcg) {
            diags.push({
                severity: 'error',
                path: iv.id,
                relatedPaths: [subUse.id],
                message: `Dose exceeds maximum: ${dose.amount} ${dose.unit} exceeds the maximum dose of `
                    + `${maxDose.amount} ${maxDose.unit} for "${subUse.name}".`,
            });
        }
    }

    return diags;
}
