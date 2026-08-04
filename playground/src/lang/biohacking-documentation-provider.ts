/**
 * Biohacking documentation provider — powers hover AND completion docs.
 *
 * Extends Langium's JSDoc provider with four features (spec:
 * docs/evidence-and-dynamic-dosing.md):
 *
 * 1. `@evidence PMID:…` / `@evidence DOI:…` JSDoc tags on declarations
 *    → linked Sources section (via documentationTagRenderer).
 * 2. Inline prose citations `(PMID:6697623, PMID:2595433)` → auto-linkified,
 *    which retroactively covers every existing std/ citation with zero
 *    migration (via getDocumentation post-pass).
 * 3. Claim-level `@evidence("PMID:…")` annotations on assignments → hover
 *    Evidence section. Assignments previously had NO hover at all; this
 *    gives them one.
 * 4. Body-weight-relative measurements (`2 g/kg`) → resolved absolute dose
 *    against the workspace `user` weight: `2 g/kg × 82 kg = 164 g`.
 *
 * Identifier vocabulary is shared with med-research-mcp (PMID numeric,
 * DOI database-agnostic) so a citation in hover is a fetchable id in the
 * agent toolchain.
 */
import { JSDocDocumentationProvider, type AstNode, type JSDocTag, type LangiumCoreServices } from 'langium';
import type { Annotation, Measurement, ScalarAssignment, StructAssignment } from './generated/ast.js';
import { isEntityDecl, isMeasurement, isScalarAssignment, isStructAssignment } from './generated/ast.js';
import {
    evidenceDisplay,
    evidenceUrl,
    findUserWeight,
    formatNumber,
    formatResolution,
    linkifyEvidenceMarkdown,
    parseEvidenceList,
    parseEvidenceRef,
    perKgDenominator,
    resolvePerKg,
} from './utils/evidence-utils.js';

export class BiohackingDocumentationProvider extends JSDocDocumentationProvider {

    private readonly services: LangiumCoreServices;

    constructor(services: LangiumCoreServices) {
        super(services);
        this.services = services;
    }

    override getDocumentation(node: AstNode): string | undefined {
        // Claim-level evidence + dynamic dosing for assignments.
        if (isScalarAssignment(node) || isStructAssignment(node)) {
            const doc = this.renderAssignmentDoc(node);
            if (doc) return doc;
        }
        // Hovering the value token lands on the Measurement itself; attach
        // to the owning assignment so the whole line reads the same.
        if (isMeasurement(node)) {
            const container = node.$container;
            if (container && (isScalarAssignment(container) || isStructAssignment(container))) {
                const doc = this.renderAssignmentDoc(container);
                if (doc) return doc;
            }
            const dosing = this.renderDosing([node]);
            if (dosing) return dosing;
            const role = this.renderUserWeightRole(node);
            if (role) return role;
        }
        // Declarations: JSDoc with @evidence tags, inline citations linked.
        const doc = super.getDocumentation(node);
        return doc ? linkifyEvidenceMarkdown(doc) : undefined;
    }

    protected override documentationTagRenderer(node: AstNode, tag: JSDocTag): string | undefined {
        if (tag.name === 'evidence') {
            const refs = parseEvidenceList(tag.content.toString());
            if (refs.length > 0) {
                return refs.map(r => `- [${evidenceDisplay(r)}](${evidenceUrl(r)})`).join('\n');
            }
        }
        return super.documentationTagRenderer(node, tag);
    }

    // ── Claim-level rendering ────────────────────────────────────────────────

    private renderAssignmentDoc(node: ScalarAssignment | StructAssignment): string | undefined {
        const sections: string[] = [];
        const evidence = this.renderEvidenceAnnotations(node.annotations);
        if (evidence) sections.push(evidence);

        const measurements: Measurement[] = [];
        if (isScalarAssignment(node)) {
            if (isMeasurement(node.value)) measurements.push(node.value);
        } else {
            for (const field of node.fields) {
                if (isScalarAssignment(field) && isMeasurement(field.value)) measurements.push(field.value);
            }
        }
        const dosing = this.renderDosing(measurements);
        if (dosing) sections.push(dosing);

        return sections.length > 0 ? sections.join('\n\n') : undefined;
    }

    private renderEvidenceAnnotations(annotations: readonly Annotation[]): string | undefined {
        const lines: string[] = [];
        for (const ann of annotations) {
            if (ann.name !== 'evidence') continue;
            const arg = ann.args[0]?.stringValue;
            if (arg === undefined) continue; // malformed — the validator warns
            const ref = parseEvidenceRef(arg);
            lines.push(ref
                ? `- [${evidenceDisplay(ref)}](${evidenceUrl(ref)})`
                : `- ${arg}`);
        }
        return lines.length > 0 ? `**Evidence**\n${lines.join('\n')}` : undefined;
    }

    // ── Dynamic dosing ───────────────────────────────────────────────────────

    private renderDosing(measurements: readonly Measurement[]): string | undefined {
        const weight = findUserWeight(this.services);
        if (!weight) return undefined;

        const lines: string[] = [];
        for (const m of measurements) {
            if (!perKgDenominator(m.unit.unit)) continue;
            const res = resolvePerKg(m.amount, m.unit.unit, weight);
            if (res) lines.push(`- ${formatResolution(res, m.amount)}`);
        }
        return lines.length > 0 ? `**Dynamic dose**\n${lines.join('\n')}` : undefined;
    }

    /** Explains a `user "…" { weight: … }` value's role in the system. */
    private renderUserWeightRole(node: Measurement): string | undefined {
        const parent = node.$container;
        if (!parent || !isScalarAssignment(parent) || parent.name !== 'weight') return undefined;
        const entity = parent.$container;
        if (!entity || !isEntityDecl(entity) || entity.type?.ref?.name !== 'user') return undefined;
        return `**User weight** — per-kg doses resolve against this (${formatNumber(node.amount)} ${node.unit.unit.join('/')})`;
    }
}
