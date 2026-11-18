import GithubSlugger from "github-slugger";
import type { Element, ElementContent, Root, RootContent, Text } from "hast";

/**
 * Build-time transforms that turn the vendored GitHub-flavoured documents
 * (READMEs and SKILL.md files, see scripts/sync-project.mjs) into sections of
 * this site. Runs after rehype-raw, on the hast tree:
 *
 * - readme mode: strips the GitHub listing chrome (centered icon, title,
 *   tagline, badges, language line, demo GIF and its caption); the in-page
 *   anchor line is kept as a mono contents row, or dropped when the page
 *   head carries it instead (liftContents, see components/readme.tsx);
 * - GitHub alerts ([!IMPORTANT]) become labelled asides;
 * - headings get GitHub-style slugs so the README's #install, #privacy and
 *   #medical-disclaimer anchors resolve; skill headings are demoted one level
 *   (the page owns the h1) and prefixed so the three documents' ids stay apart;
 * - links to the repo's blob/tree at main are pinned to the vendored SHA, and
 *   relative links resolve against GitHub at that SHA;
 * - any image that survives is dropped: the page serves no third-party assets.
 */

const REPO_URL = "https://github.com/emilkrebs/med-research-mcp";
const REPO_BLOB_MAIN = /^https?:\/\/github\.com\/emilkrebs\/med-research-mcp\/(blob|tree)\/main\//;
const ALERT_MARKER = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*\r?\n?/;

export interface ProjectDocOptions {
    /** The commit the document was vendored at; links are pinned to it. */
    sha: string;
    mode: "readme" | "skill";
    /** Skill mode: prefix for heading ids, unique per skill. */
    idPrefix?: string;
    /** Readme mode: the page head renders the contents line, so drop it here. */
    liftContents?: boolean;
}

function isElement(node: RootContent | ElementContent | undefined): node is Element {
    return node?.type === "element";
}

function textOf(node: RootContent | ElementContent): string {
    if (node.type === "text") return (node as Text).value;
    if ("children" in node) return node.children.map(textOf).join("");
    return "";
}

function descendants(node: Element, tagName: string): Element[] {
    const found: Element[] = [];
    const visit = (current: ElementContent) => {
        if (isElement(current)) {
            if (current.tagName === tagName) found.push(current);
            current.children.forEach(visit);
        }
    };
    node.children.forEach(visit);
    return found;
}

function walk(node: Root | Element, visit: (element: Element) => void) {
    for (const child of node.children) {
        if (isElement(child)) {
            visit(child);
            walk(child, visit);
        }
    }
}

/** The leading run of centered header blocks, before the prose starts. */
function stripChrome(tree: Root, liftContents?: boolean) {
    const children = tree.children;
    let i = 0;
    while (i < children.length) {
        const node = children[i];
        if (node.type === "text" && !node.value.trim()) {
            i++;
            continue;
        }
        if (!isElement(node)) break;
        if (node.tagName === "h1") {
            children.splice(i, 1);
            continue;
        }
        if (node.tagName === "p" && node.properties?.align === "center") {
            const links = descendants(node, "a");
            const hasMedia = descendants(node, "img").length > 0 || descendants(node, "sub").length > 0;
            const isLanguageLine = links.some((a) => /README(\.zh-CN)?\.md$/.test(String(a.properties?.href ?? "")));
            const isAnchorLine = links.length > 0 && links.every((a) => String(a.properties?.href ?? "").startsWith("#"));
            if (isAnchorLine && !hasMedia && !isLanguageLine) {
                if (liftContents) {
                    children.splice(i, 1);
                    continue;
                }
                delete node.properties.align;
                node.properties.className = ["readme-contents"];
                i++;
                continue;
            }
            children.splice(i, 1);
            continue;
        }
        break;
    }
}

/**
 * Remove one section, heading included, up to the next heading of the same or
 * a higher level. The page renders the agent skills itself (with downloads),
 * so the README's own section is dropped instead of being said twice.
 */
function dropSection(tree: Root, pattern: RegExp) {
    const children = tree.children;
    for (let i = 0; i < children.length; i++) {
        const node = children[i];
        if (!isElement(node) || !/^h[1-6]$/.test(node.tagName)) continue;
        if (!pattern.test(textOf(node).trim())) continue;
        const level = Number(node.tagName[1]);
        let end = i + 1;
        while (end < children.length) {
            const next = children[end];
            if (isElement(next) && /^h[1-6]$/.test(next.tagName) && Number(next.tagName[1]) <= level) break;
            end++;
        }
        children.splice(i, end - i);
        i--;
    }
}

function transformAlerts(tree: Root) {
    walk(tree, (node) => {
        if (node.tagName !== "blockquote") return;
        const first = node.children.find(isElement);
        if (!first || first.tagName !== "p") return;
        const firstText = first.children.find((child): child is Text => child.type === "text");
        const marker = firstText && ALERT_MARKER.exec(firstText.value);
        if (!marker) return;
        firstText.value = firstText.value.slice(marker[0].length);
        node.properties.className = ["readme-alert"];
        node.children.unshift({
            type: "element",
            tagName: "p",
            properties: { className: ["readme-alert-label"] },
            children: [{ type: "text", value: marker[1] }],
        });
    });
}

function slugHeadings(tree: Root, mode: ProjectDocOptions["mode"], idPrefix?: string) {
    const slugger = new GithubSlugger();
    walk(tree, (node) => {
        if (!/^h[1-6]$/.test(node.tagName)) return;
        const level = Number(node.tagName[1]);
        // The page owns the single h1; skills sit one level deeper still.
        const target = mode === "skill" ? Math.min(6, level + 1) : Math.max(2, level);
        node.tagName = `h${target}`;
        const slug = slugger.slug(textOf(node));
        node.properties.id = idPrefix ? `${idPrefix}-${slug}` : slug;
    });
}

function pinLinks(tree: Root, sha: string) {
    walk(tree, (node) => {
        if (node.tagName !== "a") return;
        const href = String(node.properties.href ?? "");
        if (href.startsWith("#") || href.startsWith("/")) return;
        if (REPO_BLOB_MAIN.test(href)) {
            node.properties.href = href.replace("/main/", `/${sha}/`);
            return;
        }
        if (!/^[a-z][a-z0-9+.-]*:/i.test(href)) {
            const path = href.replace(/^\.\//, "");
            const kind = path.endsWith("/") ? "tree" : "blob";
            node.properties.href = `${REPO_URL}/${kind}/${sha}/${path}`;
        }
    });
}

/** Safety net: no image from another host may render, whatever upstream adds. */
function dropImages(tree: Root) {
    const prune = (node: Root | Element) => {
        node.children = node.children.filter((child) => {
            if (isElement(child)) {
                if (child.tagName === "img") return false;
                prune(child);
                if (child.tagName === "p" && child.children.every((c) => c.type === "text" && !c.value.trim())) return false;
            }
            return true;
        });
    };
    prune(tree);
}

export function rehypeProjectDoc(options: ProjectDocOptions) {
    return (tree: Root) => {
        if (options.mode === "readme") {
            stripChrome(tree, options.liftContents);
            dropSection(tree, /^(agent skills|智能体技能)$/i);
        }
        transformAlerts(tree);
        slugHeadings(tree, options.mode, options.idPrefix);
        pinLinks(tree, options.sha);
        dropImages(tree);
    };
}
