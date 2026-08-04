/**
 * The curated high-risk interaction catalog — reading, not storing.
 *
 * WHERE THE DATA LIVES
 * builtin/interactions.bio, as ordinary `interaction` declarations typed by
 * builtin/core.bio. This module is only the reader. It replaced
 * data/known-interactions.ts, a 34-entry TypeScript table that duplicated what
 * the conflicts/synergies marker graph in @std/interactions.bio already said:
 * two systems covering serotonin syndrome, anticoagulation and CNS depression,
 * neither updated when the other changed.
 *
 * TWO ENTRY POINTS, ONE FORMAT. The Langium validator reads the AST (it has
 * documents, not IR); the IR validator reads a CompilerIR (it runs in the
 * visual builder, where there is no AST). Both produce {@link InteractionEntry}
 * and go through {@link findInteraction}, so a diagnostic cannot depend on
 * which side asked.
 *
 * Browser-safe: no Node.js imports.
 */
import type { EntityDecl, Model } from '../generated/ast.js';
import { isEntityDecl, isIdentValue, isScalarAssignment, isTextValue } from '../generated/ast.js';
import type { CompilerIR, InteractionIR } from '../ir/types.js';

/** The type whose instances make up the catalog. Declared in builtin/core.bio. */
export const INTERACTION_TYPE = 'interaction';

export type InteractionSeverity = 'critical' | 'high' | 'moderate';

const SEVERITIES: readonly string[] = ['critical', 'high', 'moderate'];

export interface InteractionEntry {
    /** The declaration's name, e.g. `MAOIs + SSRIs`. */
    name: string;
    a: string;
    b: string;
    severity: InteractionSeverity;
    message: string;
}

/**
 * Severity as an InteractionIR `weight`, and back.
 *
 * The IR carries the catalog inside `interactions` (see translator/ast-to-ir.ts
 * for why they are not entities), whose persisted columns are weight/note/
 * source. Rather than add a column — and with it a schema version bump that
 * would reject every existing .protocol file — severity rides in `weight`,
 * which means the same thing. The exact word survives in the message text.
 */
const SEVERITY_TO_WEIGHT: Record<InteractionSeverity, NonNullable<InteractionIR['weight']>> = {
    critical: 'high',
    high: 'medium',
    moderate: 'low',
};

const WEIGHT_TO_SEVERITY: Record<string, InteractionSeverity> = {
    high: 'critical',
    medium: 'high',
    low: 'moderate',
};

export function severityToWeight(severity: InteractionSeverity): NonNullable<InteractionIR['weight']> {
    return SEVERITY_TO_WEIGHT[severity];
}

/**
 * True for an interaction that came from an `interaction` DECLARATION rather
 * than from a substance's conflicts/synergies. Only declared ones carry both a
 * severity (as `weight`) and a message (as `note`) — the derived edges have
 * neither, which is what makes this a reliable discriminator after a round trip
 * through SQLite.
 */
export function isCatalogInteraction(ix: InteractionIR): boolean {
    return ix.note !== undefined && ix.weight !== undefined && ix.relType === 'negative';
}

// ── Lookup ───────────────────────────────────────────────────────────────────

/** Canonical key for a pair: case-insensitive and order-independent. */
function pairKey(a: string, b: string): string {
    return [a.toLowerCase(), b.toLowerCase()].sort().join('|');
}

/**
 * Indexed catalog. Built per validation pass rather than at module load,
 * because the entries are now data the user can add to.
 */
export class InteractionCatalog {
    private readonly byPair = new Map<string, InteractionEntry>();

    constructor(entries: Iterable<InteractionEntry> = []) {
        for (const entry of entries) {
            // First declaration wins, so a builtin entry is not silently
            // replaced by a later duplicate.
            const key = pairKey(entry.a, entry.b);
            if (!this.byPair.has(key)) this.byPair.set(key, entry);
        }
    }

    get size(): number {
        return this.byPair.size;
    }

    /** Case-insensitive lookup of a catalog entry for two entity names. */
    find(a: string, b: string): InteractionEntry | undefined {
        return this.byPair.get(pairKey(a, b));
    }

    entries(): InteractionEntry[] {
        return [...this.byPair.values()];
    }
}

// ── AST source (Langium validator) ───────────────────────────────────────────

function scalarText(entity: EntityDecl, member: string): string | undefined {
    for (const assignment of entity.assignments) {
        if (!isScalarAssignment(assignment) || assignment.name !== member) continue;
        const value = assignment.value;
        if (isTextValue(value) || isIdentValue(value)) return String(value.value);
    }
    return undefined;
}

/** Reads one `interaction "..." { ... }` declaration, or undefined if incomplete. */
export function entryFromDecl(decl: EntityDecl): InteractionEntry | undefined {
    const a = scalarText(decl, 'a');
    const b = scalarText(decl, 'b');
    const message = scalarText(decl, 'message');
    const severity = scalarText(decl, 'severity');
    // A half-written declaration is reported by the structural checks; there is
    // nothing useful to match on, so it is skipped rather than half-applied.
    if (!a || !b || !message || !severity || !SEVERITIES.includes(severity)) return undefined;
    return { name: decl.name, a, b, message, severity: severity as InteractionSeverity };
}

/**
 * Catalog entries declared at the top level of a parsed document.
 *
 * Top level only: an `interaction` nested inside a stack would be a statement
 * scoped to that stack, which is not a thing the language means.
 */
export function entriesFromModel(model: Model): InteractionEntry[] {
    const result: InteractionEntry[] = [];
    for (const decl of model.declarations) {
        if (!isEntityDecl(decl)) continue;
        if (!isInteractionType(decl)) continue;
        const entry = entryFromDecl(decl);
        if (entry) result.push(entry);
    }
    return result;
}

/**
 * True when the declaration's type is `interaction` or extends it. The written
 * name is checked first so a document parsed without the builtin library — where
 * the type reference does not resolve — still sees its own catalog.
 */
function isInteractionType(decl: EntityDecl): boolean {
    if (decl.type?.$refText === INTERACTION_TYPE) return true;
    let current = decl.type?.ref?.superType?.ref;
    const seen = new Set<unknown>();
    while (current && !seen.has(current)) {
        if (current.name === INTERACTION_TYPE) return true;
        seen.add(current);
        current = current.superType?.ref;
    }
    return false;
}

// ── IR source (visual builder) ───────────────────────────────────────────────

/**
 * Catalog entries carried by a CompilerIR. The translator folds `interaction`
 * declarations into `ir.interactions` rather than `ir.entities`; see
 * translator/ast-to-ir.ts.
 */
export function entriesFromIR(ir: CompilerIR): InteractionEntry[] {
    const result: InteractionEntry[] = [];
    for (const ix of ir.interactions) {
        if (!isCatalogInteraction(ix)) continue;
        result.push({
            name: ix.source ?? `${ix.entities[0]} + ${ix.entities[1]}`,
            a: ix.entities[0],
            b: ix.entities[1],
            severity: WEIGHT_TO_SEVERITY[ix.weight!] ?? 'moderate',
            message: ix.note!,
        });
    }
    return result;
}

/** Convenience: the indexed catalog for a CompilerIR. */
export function catalogFromIR(ir: CompilerIR): InteractionCatalog {
    return new InteractionCatalog(entriesFromIR(ir));
}
