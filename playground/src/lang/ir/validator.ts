import type { CompilerIR, EntityIR, TypeRefIR } from './types.js';
import {
    entitiesOfType, isSubtypeOf, memberOf, stringListProp, structMeasurement, structProp, textProp,
} from './types.js';

export interface IRDiagnostic {
    severity: 'error' | 'warning';
    path: string;
    message: string;
    /** Additional IR paths involved in the finding (e.g. both sides of an interaction). */
    relatedPaths?: string[];
}

/**
 * `time_of_day` and `status` used to be hardcoded Sets here, duplicating the
 * `oneof(...)` vocabularies declared in builtin/core.bio — two sources of
 * truth that could (and did) drift. They're now enforced generically by
 * `checkEnumProps` below, which reads allowed values straight from `ir.types`,
 * the same way the Langium-side `checkValueTypes` does.
 */

/** Unwraps a member's declared type to its enum values, including `[oneof(...)]`. */
function enumValues(type: TypeRefIR): string[] | undefined {
    if (type.kind === 'enum') return type.values;
    if (type.kind === 'list') return enumValues(type.element);
    return undefined;
}

/**
 * Generic enum-membership check: for every prop the entity's type chain
 * declares as `oneof(...)` (scalar or list), every value actually written
 * must be one of the declared values. Unset props are untouched here — a
 * type-level `= active` default applies to those, so only an explicit,
 * unrecognised value is reported.
 *
 * Works for builtins and user-defined types alike since it never names a
 * type or member — it only reads `ir.types`.
 */
function checkEnumProps(ir: CompilerIR, entity: EntityIR, diags: IRDiagnostic[]): void {
    for (const key of Object.keys(entity.props)) {
        const member = memberOf(ir, entity.type, key);
        const values = member && enumValues(member.type);
        if (!values) continue;

        for (const value of stringListProp(entity, key)) {
            if (!values.includes(value)) {
                diags.push({
                    severity: 'error',
                    path: `${entity.id}.props.${key}`,
                    message: `Unknown ${key} "${value}". Use one of: ${values.join(', ')}.`,
                });
            }
        }
    }
}

/** `entity` plus every entity nested in its `children`, recursively. */
function withDescendants(entity: EntityIR, out: EntityIR[]): void {
    out.push(entity);
    entity.children.forEach(child => withDescendants(child, out));
}

export function validateIR(ir: CompilerIR): IRDiagnostic[] {
    const diags: IRDiagnostic[] = [];

    // Generic enum check across every entity, including ones nested inside
    // stacks/protocols/phases — broader than the old per-type checks, which
    // only looked at top-level interventions and protocols.
    const allEntities: EntityIR[] = [];
    ir.entities.forEach(e => withDescendants(e, allEntities));
    allEntities.forEach(e => checkEnumProps(ir, e, diags));

    // `entitiesOfType` includes subtypes, so a user's `type peptide extends
    // substance` is validated exactly like a builtin substance would be.
    const substances = entitiesOfType(ir, 'substance');
    const interventions = entitiesOfType(ir, 'intervention');
    const stacks = entitiesOfType(ir, 'stack');
    const substanceNames = new Set(substances.map((s) => s.name));
    const interventionNames = new Set(interventions.map((iv) => iv.name));
    const stackNames = new Set(stacks.map((s) => s.name));

    // Substances
    substances.forEach((s) => {
        if (!s.name.trim()) {
            diags.push({ severity: 'error', path: `${s.id}.name`, message: 'Substance name must not be empty.' });
        }
    });

    // Interventions
    interventions.forEach((iv) => {
        validateIntervention(ir, iv, diags, substanceNames);
    });

    // Stacks
    stacks.forEach((st) => {
        if (!st.name.trim()) {
            diags.push({ severity: 'error', path: `${st.id}.name`, message: 'Stack name must not be empty.' });
        }
        st.uses.forEach((use, ui) => {
            if (isSubtypeOf(ir, use.targetType, 'intervention') && !interventionNames.has(use.targetName)) {
                diags.push({ severity: 'warning', path: `${st.id}.uses[${ui}]`, message: `Unknown intervention ref "${use.targetName}".` });
            }
            if (isSubtypeOf(ir, use.targetType, 'stack') && !stackNames.has(use.targetName)) {
                diags.push({ severity: 'warning', path: `${st.id}.uses[${ui}]`, message: `Unknown stack ref "${use.targetName}".` });
            }
        });
    });

    // Protocols
    entitiesOfType(ir, 'protocol').forEach((p) => {
        validateProtocol(ir, p, diags, interventionNames, stackNames);
    });

    return diags;
}

function validateIntervention(ir: CompilerIR, iv: EntityIR, diags: IRDiagnostic[], substanceNames: Set<string>): void {
    if (!iv.name.trim()) {
        diags.push({ severity: 'error', path: `${iv.id}.name`, message: 'Intervention name must not be empty.' });
    }

    // v1's `substanceRef` is now a `use` targeting a substance (or subtype).
    const subUse = iv.uses.find((u) => isSubtypeOf(ir, u.targetType, 'substance'));
    if (subUse && !substanceNames.has(subUse.targetName)) {
        diags.push({ severity: 'warning', path: `${iv.id}.uses`, message: `Unknown substance ref "${subUse.targetName}".` });
    }

    // time_of_day's vocabulary is checked generically by checkEnumProps, above.
    const timeOfDay = textProp(iv, 'time_of_day');
    if (timeOfDay && iv.props.frequency === undefined) {
        diags.push({
            severity: 'warning',
            path: `${iv.id}.props.time_of_day`,
            message: 'time_of_day is set but no dosing frequency is defined. Add a frequency block.',
        });
    }

    const doseAmount = structMeasurement(structProp(iv, 'dose'), 'amount');
    if (doseAmount && doseAmount.amount < 0) {
        diags.push({ severity: 'error', path: `${iv.id}.props.dose.amount`, message: 'Dose amount must be non-negative.' });
    }
}

function validateProtocol(
    ir: CompilerIR,
    p: EntityIR,
    diags: IRDiagnostic[],
    interventionNames: Set<string>,
    stackNames: Set<string>,
): void {
    if (!p.name.trim()) {
        diags.push({ severity: 'error', path: `${p.id}.name`, message: 'Protocol name must not be empty.' });
    }
    // status's vocabulary is checked generically by checkEnumProps, above.
    for (const phase of p.children) {
        if (!isSubtypeOf(ir, phase.type, 'phase')) continue;
        validatePhase(ir, phase, diags, interventionNames, stackNames);
    }
}

function validatePhase(
    ir: CompilerIR,
    ph: EntityIR,
    diags: IRDiagnostic[],
    interventionNames: Set<string>,
    stackNames: Set<string>,
): void {
    if (!ph.name.trim()) {
        diags.push({ severity: 'error', path: `${ph.id}.name`, message: 'Phase name must not be empty.' });
    }
    ph.uses.forEach((use, ui) => {
        if (isSubtypeOf(ir, use.targetType, 'intervention') && !interventionNames.has(use.targetName)) {
            diags.push({ severity: 'warning', path: `${ph.id}.uses[${ui}]`, message: `Unknown intervention ref "${use.targetName}".` });
        }
        if (isSubtypeOf(ir, use.targetType, 'stack') && !stackNames.has(use.targetName)) {
            diags.push({ severity: 'warning', path: `${ph.id}.uses[${ui}]`, message: `Unknown stack ref "${use.targetName}".` });
        }
    });
}
