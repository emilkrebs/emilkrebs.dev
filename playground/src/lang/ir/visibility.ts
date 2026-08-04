/**
 * Relevance filter for the protocol graph.
 *
 * The IR holds EVERY entity reachable through the import chain — a protocol
 * importing "@std/supplements" carries the whole library with it. The graph
 * should show only what the compiled document actually touches:
 *
 *  1. entities declared IN the compiled document (origin 'entry'),
 *  2. the transitive closure over what they reference — `use` targets,
 *     inline children and entity-level `extends`,
 *  3. interaction partners of visible entities, pulled in as LEAVES (their
 *     own uses/children are not expanded — they are context, not members),
 *     so conflict/synergy edges never dangle.
 *
 * IR without provenance (AI-normalized IR, decompiled IR) has no 'entry'
 * marker — consumers treat every entity as part of the protocol, which is
 * exactly the current behaviour for those paths.
 */
import type { CompilerIR, EntityIR } from './types.js';
import { entityId } from './types.js';

function walkAll(entities: readonly EntityIR[], visit: (e: EntityIR) => void): void {
    const step = (e: EntityIR): void => {
        visit(e);
        for (const child of e.children) step(child);
    };
    for (const root of entities) step(root);
}

export function selectVisibleEntities(ir: CompilerIR): EntityIR[] {
    const byId = new Map<string, EntityIR>();
    const byName = new Map<string, EntityIR>();
    const all: EntityIR[] = [];
    walkAll(ir.entities, (e) => {
        all.push(e);
        byId.set(e.id, e);
        // Interaction lists and entity-level extends reference bare names, so
        // a name index is needed to resolve them back to entities. First
        // declaration wins on collision — mirrors irToGraph.
        if (!byName.has(e.name)) byName.set(e.name, e);
    });

    const visible = new Set<EntityIR>();
    const queue: EntityIR[] = [];
    const enqueue = (e: EntityIR | undefined): void => {
        if (e && !visible.has(e)) {
            visible.add(e);
            queue.push(e);
        }
    };

    // Roots: everything declared in the compiled document. Without provenance
    // (AI/decompiled IR) everything is a root.
    for (const e of all) {
        if (e.origin === undefined || e.origin === 'entry') enqueue(e);
    }

    // Transitive closure over children, extends and use targets.
    while (queue.length > 0) {
        const e = queue.shift()!;
        for (const child of e.children) enqueue(child);
        if (e.extends) enqueue(byName.get(e.extends) ?? byId.get(entityId(e.type, e.extends)));
        for (const use of e.uses) {
            enqueue(byId.get(entityId(use.targetType, use.targetName)) ?? byName.get(use.targetName));
        }
    }

    // Interaction partners as leaves: an edge between two visible members is
    // kept whole, a visible member's partner is pulled in so the edge still
    // lands on something — but the partner's own content stays hidden.
    for (const interaction of ir.interactions) {
        const [a, b] = interaction.entities;
        const ea = byName.get(a);
        const eb = byName.get(b);
        if (!ea || !eb) continue;
        if (visible.has(ea) && !visible.has(eb)) visible.add(eb);
        if (visible.has(eb) && !visible.has(ea)) visible.add(ea);
    }

    return all.filter((e) => visible.has(e));
}
