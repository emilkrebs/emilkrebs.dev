import { AstNode, isAstNode } from 'langium';
import {
    isEntityDecl,
    isIdentValue,
    isScalarAssignment,
    isTextValue,
    isUnit,
    Model,
} from '../generated/ast.js';

function traverse(node: AstNode, callback: (node: AstNode) => void, visited: Set<AstNode> = new Set()): void {
    if (visited.has(node)) {
        return;
    }
    visited.add(node);
    callback(node);

    for (const value of Object.values(node)) {
        if (isAstNode(value)) {
            traverse(value, callback, visited);
        } else if (Array.isArray(value)) {
            for (const item of value) {
                if (isAstNode(item)) {
                    traverse(item, callback, visited);
                }
            }
        }
    }
}

// Strips a single layer of surrounding quote characters (" or '), but only
// when the first AND last characters are a matching pair — never
// unconditionally, since depending on the value converter the text may
// already arrive unquoted.
function unquote(text: string): string {
    if (text.length >= 2) {
        const first = text[0];
        const last = text[text.length - 1];
        if ((first === '"' || first === "'") && first === last) {
            return text.slice(1, -1);
        }
    }
    return text;
}

export function collectGroups(model: Model): Set<string> {
    const groups = new Set<string>();
    traverse(model, (node) => {
        if (isScalarAssignment(node) && node.name === 'group' && isIdentValue(node.value)) {
            groups.add(unquote(node.value.value));
        }
    });
    return groups;
}

export function collectRoutes(model: Model): Set<string> {
    const routes = new Set<string>();
    traverse(model, (node) => {
        if (isScalarAssignment(node) && node.name === 'route' && isIdentValue(node.value)) {
            routes.add(unquote(node.value.value));
        }
    });
    return routes;
}

export function collectUnits(model: Model): Set<string> {
    const units = new Set<string>();
    traverse(model, (node) => {
        if (isUnit(node)) {
            units.add(node.unit.join('/'));
        }
    });
    return units;
}

// Names/markers worth suggesting inside a `conflicts`/`synergies` list: the
// name of every declared entity (the things you'd actually list as
// interacting), plus any target markers or conflict/synergy strings already
// used elsewhere in the document.
export function collectConflictSynergyCandidates(model: Model): Set<string> {
    const candidates = new Set<string>();
    traverse(model, (node) => {
        if (isEntityDecl(node)) {
            candidates.add(node.name);
        } else if (
            isScalarAssignment(node) &&
            (node.name === 'targets' || node.name === 'conflicts' || node.name === 'synergies')
        ) {
            // The value is normally a ListValue of TextValues, but a scalar
            // is a legal one-element list, so a bare TextValue is possible
            // too — traverse handles both since it invokes the callback on
            // the root node it's given before descending into any children.
            traverse(node.value, (inner) => {
                if (isTextValue(inner)) {
                    candidates.add(unquote(inner.value));
                }
            });
        }
    });
    return candidates;
}
