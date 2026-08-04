/**
 * Evidence & dynamic-dosing helpers, shared between the documentation
 * provider (hover) and the validator.
 *
 * Identifier vocabulary is aligned with med-research-mcp: PMID (numeric,
 * pubmed/europepmc) and DOI (database-agnostic). See the spec at
 * ../../../../docs/evidence-and-dynamic-dosing.md
 */
import type { LangiumCoreServices } from 'langium';
import type { EntityDecl, Measurement } from '../generated/ast.js';
import { isEntityDecl, isMeasurement, isModel, isScalarAssignment, isStructAssignment } from '../generated/ast.js';
import { isBundledUri, isBuiltinUri } from './std-lib.js';
// The canonical citation type lives on the IR contract; this module re-exports
// it so hover and validator stay on the SAME type as the compiler/graph.
import type { EvidenceRef } from '../ir/types.js';

export type { EvidenceRef };

// ── Evidence identifiers ────────────────────────────────────────────────────

/** Parses a single citation token into a normalized reference. */
export function parseEvidenceRef(token: string): EvidenceRef | undefined {
    const t = token.trim();
    const pmid = /^PMID:(\d{1,9})$/i.exec(t);
    if (pmid) return { kind: 'PMID', id: pmid[1] };
    // DOI with explicit prefix or bare — both link to doi.org.
    const doi = /^(?:DOI:)?(10\.\d{4,9}\/.+)$/i.exec(t);
    if (doi) return { kind: 'DOI', id: doi[1] };
    return undefined;
}

export function evidenceUrl(ref: EvidenceRef): string {
    // Slashes stay raw (doi.org/10.x/y); parens get encoded so the markdown
    // link doesn't break on DOIs like 10.1007/978-3-319-12345-6(1).
    const encoded = ref.id.replace(/\(/g, '%28').replace(/\)/g, '%29');
    return ref.kind === 'PMID'
        ? `https://pubmed.ncbi.nlm.nih.gov/${ref.id}/`
        : `https://doi.org/${encoded}`;
}

export function evidenceDisplay(ref: EvidenceRef): string {
    return `${ref.kind}:${ref.id}`;
}

/**
 * Splits a citation list (from an `@evidence` JSDoc tag) on commas.
 * `@evidence PMID:6697623, PMID:2595433` → two refs.
 */
export function parseEvidenceList(text: string): EvidenceRef[] {
    const refs: EvidenceRef[] = [];
    for (const part of text.split(',')) {
        const ref = parseEvidenceRef(part);
        if (ref) refs.push(ref);
    }
    return refs;
}

// ── Inline linkification ─────────────────────────────────────────────────────

/** PMID: 1–9 digits, word-bounded. */
const PMID_PATTERN = /\bPMID:\d{1,9}\b/gi;
/** DOI (prefixed or bare): 10.<4-9 digits>/<suffix>. */
const DOI_PATTERN = /\b(?:DOI:)?10\.\d{4,9}\/[^\s]+/gi;
const COMBINED_PATTERN = new RegExp(`(${PMID_PATTERN.source})|(${DOI_PATTERN.source})`, 'gi');

/** Splits a captured DOI token into its core and trailing punctuation/wrappers. */
function splitTrailingPunct(token: string): { core: string; trailing: string } {
    const m = /^(.*?)([.,;:!?)\]}"']*)$/.exec(token);
    let core = m ? m[1] : token;
    let trailing = m ? m[2] : '';
    // A trailing ')' is part of the DOI itself when the core's parens balance
    // — 10.1007/978-3-319-12345-6(1) keeps its closing paren, while the
    // wrapper in (DOI:10.1007/x) is left as plain text after the link.
    while (trailing.startsWith(')')
        && (core.match(/\(/g) ?? []).length > (core.match(/\)/g) ?? []).length) {
        core += ')';
        trailing = trailing.slice(1);
    }
    return { core, trailing };
}

/**
 * Turns every `PMID:<id>` / `DOI:<doi>` occurrence in rendered markdown into
 * a clickable link. Each citation in a comma-separated parenthetical links
 * individually: `(PMID:6697623, PMID:2595433)` → both linked, punctuation
 * and wrapper parens preserved as plain text. DOI parens are kept when
 * balanced (`10.1007/978-3-319-12345-6(1)` stays intact). Existing markdown
 * links (`[...](...)`) are protected — rendered `@evidence` tags never get
 * double-linkified.
 */
export function linkifyEvidenceMarkdown(markdown: string): string {
    if (!markdown) return markdown;

    // Protect existing markdown links from the identifier pass below.
    const protectedSpans: string[] = [];
    const withPlaceholders = markdown.replace(/\[[^\]]*\]\([^)]*\)/g, (m) => {
        protectedSpans.push(m);
        return `\u0000${protectedSpans.length - 1}\u0000`;
    });

    const linked = withPlaceholders.replace(COMBINED_PATTERN, (match, pmid: string | undefined, doi: string | undefined) => {
        if (pmid) {
            const ref = parseEvidenceRef(pmid);
            if (!ref) return match;
            return `[${evidenceDisplay(ref)}](${evidenceUrl(ref)})`;
        }
        const { core, trailing } = splitTrailingPunct(doi ?? match);
        const ref = parseEvidenceRef(core);
        if (!ref) return match;
        return `[${core}](${evidenceUrl(ref)})${trailing}`;
    });

    return linked.replace(/\u0000(\d+)\u0000/g, (_, i: string) => protectedSpans[Number(i)]);
}

// ── Dynamic dosing (per-body-weight) ─────────────────────────────────────────

/** Body-mass denominator units that mark a measurement as weight-relative. */
const BODY_MASS_UNITS = new Set(['kg', 'lb']);

/**
 * Returns the body-mass denominator of a compound unit, e.g. `g/kg` → 'kg',
 * `mg/lb` → 'lb'. The denominator must sit after a '/' — a bare `kg` unit is
 * a mass value, not a per-kg marker, and `mg/dL` has no body-mass
 * denominator at all.
 */
export function perKgDenominator(unitParts: readonly string[]): string | undefined {
    for (let i = 1; i < unitParts.length; i++) {
        const u = unitParts[i].toLowerCase();
        if (BODY_MASS_UNITS.has(u)) return u;
    }
    return undefined;
}

const KG_PER_LB = 0.45359237;

function toKg(amount: number, unit: string): number | undefined {
    const u = unit.toLowerCase();
    if (u === 'kg') return amount;
    if (u === 'lb') return amount * KG_PER_LB;
    return undefined;
}

export interface WeightValue {
    amount: number;
    unit: string;
}

export interface PerKgResolution {
    /** Absolute dose in the numerator unit, e.g. 164 for 2 g/kg × 82 kg. */
    value: number;
    /** Numerator unit, e.g. 'g'. */
    unit: string;
    /** Original compound unit, e.g. 'g/kg'. */
    perKgUnit: string;
    /** Weight converted into the denominator unit. */
    weightAmount: number;
    weightUnit: string;
    /** True when the result was rounded (rendered with ≈). */
    rounded: boolean;
}

/** Rounds to at most `decimals`; returns the rounded value. */
function roundTo(value: number, decimals: number): number {
    const f = 10 ** decimals;
    return Math.round(value * f) / f;
}

/**
 * Resolves a body-weight-relative measurement against a weight value.
 * `2 g/kg` × 82 kg → { value: 164, unit: 'g' }. Weight is converted into the
 * denominator unit (kg ↔ lb only — the one conversion the body-mass marker
 * can demand; deeper unit handling stays in the IDE extension's grammar
 * engine).
 */
export function resolvePerKg(
    amount: number,
    unitParts: readonly string[],
    weight: WeightValue,
): PerKgResolution | undefined {
    const den = perKgDenominator(unitParts);
    if (!den) return undefined;
    const kg = toKg(weight.amount, weight.unit);
    if (kg === undefined || !Number.isFinite(kg) || kg <= 0) return undefined;
    const weightInDen = den === 'lb' ? kg / KG_PER_LB : kg;
    if (!Number.isFinite(weightInDen) || weightInDen <= 0) return undefined;

    const raw = amount * weightInDen;
    const value = roundTo(raw, 4);
    return {
        value,
        unit: unitParts[0],
        perKgUnit: unitParts.join('/'),
        weightAmount: roundTo(weightInDen, 2),
        weightUnit: den,
        rounded: value !== raw,
    };
}

/** Collects every Measurement in an entity body (direct + struct fields). */
export function collectMeasurements(entity: EntityDecl): Measurement[] {
    const out: Measurement[] = [];
    const visit = (assignments: readonly unknown[]): void => {
        for (const a of assignments) {
            if (isScalarAssignment(a)) {
                if (isMeasurement(a.value)) out.push(a.value);
            } else if (isStructAssignment(a)) {
                visit(a.fields);
            }
        }
    };
    visit(entity.assignments);
    return out;
}

/**
 * Finds the workspace's body weight: the first `user` entity with a
 * `weight` member in any non-bundled document. Bundled std/builtin docs are
 * skipped by URI scheme — a user entity lives in the client's own file.
 */
export function findUserWeight(services: LangiumCoreServices): WeightValue | undefined {
    let found: WeightValue | undefined;
    services.shared.workspace.LangiumDocuments.all.forEach((doc) => {
        if (found) return;
        if (isBundledUri(doc.uri) || isBuiltinUri(doc.uri)) return;
        const model = doc.parseResult?.value;
        if (!isModel(model)) return;
        for (const decl of model.declarations) {
            if (!isEntityDecl(decl) || decl.type?.ref?.name !== 'user') continue;
            for (const a of decl.assignments) {
                if (!isScalarAssignment(a) || a.name !== 'weight' || !isMeasurement(a.value)) continue;
                const unitParts = a.value.unit.unit;
                const amount = a.value.amount;
                if (unitParts.length === 0 || !Number.isFinite(amount) || amount <= 0) continue;
                found = { amount, unit: unitParts.join('/') };
                return;
            }
        }
    });
    return found;
}

/** Renders a per-kg resolution as the hover formula line, e.g. `2 g/kg × 82 kg = 164 g`. */
export function formatResolution(res: PerKgResolution, amount: number): string {
    const value = formatNumber(res.value);
    const weight = formatNumber(res.weightAmount);
    return `${formatNumber(amount)} ${res.perKgUnit} × ${weight} ${res.weightUnit} = ${res.rounded ? '≈ ' : ''}${value} ${res.unit}`;
}

export function formatNumber(n: number): string {
    return String(roundTo(n, 4));
}
