import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { rehypeProjectDoc } from "../lib/rehype-project-doc";
import { SmartLink } from "./smart-link";

/**
 * Renders the vendored GitHub-flavoured project documents (the READMEs and
 * the SKILL.md files) as sections of this site: GFM tables and alerts, raw
 * HTML, GitHub heading slugs, links pinned to the vendored SHA. The transforms
 * live in lib/rehype-project-doc.ts.
 *
 * rehype-raw widens what the renderer accepts. That is acceptable only because
 * the input is a vendored copy of our own repo at a pinned SHA
 * (scripts/sync-project.mjs): never point it at a URL, a PR branch or a fork.
 */

const PROVENANCE = /^<!-- vendored from [^\n]*-->\n/;
const FRONTMATTER = /^---\n([\s\S]*?)\n---\n/;
const CENTERED_BLOCK = /<p align="center">([\s\S]*?)<\/p>/g;
const ANCHOR_LINK = /<a href="(#[^"]+)">([^<]+)<\/a>/g;

/**
 * The README's own in-page contents line (the centered paragraph whose links
 * are all anchors), so the page head can carry it as a jump row with the
 * README's own localized labels. Returns [] when no such line exists; the
 * renderer then keeps the line in the body as a fallback.
 */
export function parseContents(content: string): { href: string; label: string }[] {
    const text = content.replace(PROVENANCE, "");
    for (const block of text.matchAll(CENTERED_BLOCK)) {
        const inner = block[1];
        if (/<img/i.test(inner)) continue;
        const links = [...inner.matchAll(ANCHOR_LINK)].map((match) => ({
            href: match[1],
            label: match[2].trim(),
        }));
        const linkCount = (inner.match(/<a /g) ?? []).length;
        if (links.length > 0 && links.length === linkCount) return links;
    }
    return [];
}

/** The vendored SKILL.md split into its frontmatter description and body. */
export function parseSkill(content: string): { description: string; body: string } {
    const text = content.replace(PROVENANCE, "");
    const match = FRONTMATTER.exec(text);
    if (!match) return { description: "", body: text };
    const description = /^description:[ \t]*(.*)$/m.exec(match[1])?.[1] ?? "";
    return { description, body: text.slice(match[0].length) };
}

const LINK_CLASS = "underline decoration-hairline underline-offset-4 hover:text-signal hover:decoration-signal transition-colors duration-150 [overflow-wrap:anywhere]";

/** Shared by both documents; the plugin decides what survives and how. */
const components = {
    h2: ({ children, id }: { children?: React.ReactNode; id?: string }) => (
        <h2 id={id} className="mt-10 mb-4 text-2xl md:text-3xl font-semibold tracking-tight leading-snug">{children}</h2>
    ),
    h3: ({ children, id }: { children?: React.ReactNode; id?: string }) => (
        <h3 id={id} className="mt-8 mb-3 text-xl md:text-2xl font-semibold tracking-tight leading-snug">{children}</h3>
    ),
    h4: ({ children, id }: { children?: React.ReactNode; id?: string }) => (
        <h4 id={id} className="mt-6 mb-2 text-lg md:text-xl font-semibold tracking-tight">{children}</h4>
    ),
    h5: ({ children, id }: { children?: React.ReactNode; id?: string }) => (
        <h5 id={id} className="mt-4 mb-2 text-base font-semibold">{children}</h5>
    ),
    h6: ({ children, id }: { children?: React.ReactNode; id?: string }) => (
        <h6 id={id} className="mt-4 mb-2 text-base font-semibold text-ink/85">{children}</h6>
    ),
    p: ({ children, className }: { children?: React.ReactNode; className?: string }) => {
        if (className?.includes("readme-contents")) {
            return (
                <p className="mb-6 flex flex-wrap gap-x-2 gap-y-1 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
                    {children}
                </p>
            );
        }
        if (className?.includes("readme-alert-label")) {
            return (
                <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-signal">
                    <span className="size-1.5 bg-signal" aria-hidden="true" />
                    {children}
                </p>
            );
        }
        return <p className="mb-4 leading-relaxed max-w-[70ch]">{children}</p>;
    },
    a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
        <SmartLink href={href ?? ""} className={LINK_CLASS}>{children}</SmartLink>
    ),
    ul: ({ children }: { children?: React.ReactNode }) => (
        <ul className="pl-6 mb-4 list-disc space-y-1 max-w-[70ch]">{children}</ul>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
        <ol className="pl-6 mb-4 list-decimal space-y-1 max-w-[70ch]">{children}</ol>
    ),
    li: ({ children }: { children?: React.ReactNode }) => <li className="leading-relaxed">{children}</li>,
    strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }: { children?: React.ReactNode }) => <em className="font-serif italic">{children}</em>,
    del: ({ children }: { children?: React.ReactNode }) => <del className="line-through">{children}</del>,
    code: ({ children }: { children?: React.ReactNode }) => (
        <code className="bg-paper-deep font-mono text-[0.85em] px-1.5 py-0.5 [overflow-wrap:anywhere]">{children}</code>
    ),
    pre: ({ children }: { children?: React.ReactNode }) => (
        <pre className="mb-4 overflow-x-auto border border-hairline bg-paper-deep p-4 font-mono text-sm leading-relaxed">{children}</pre>
    ),
    blockquote: ({ children, className }: { children?: React.ReactNode; className?: string }) =>
        className?.includes("readme-alert") ? (
            <aside className="mb-6 border border-hairline bg-paper-deep p-4 md:p-5">{children}</aside>
        ) : (
            <blockquote className="mb-4 border-l-2 border-ink/30 pl-4 text-ink/85 max-w-[70ch]">{children}</blockquote>
        ),
    hr: () => <hr className="my-8 border-hairline" />,
    table: ({ children }: { children?: React.ReactNode }) => (
        <div className="mb-6 overflow-x-auto border border-hairline">
            {/* The min-width keeps columns legible on phones: the wrapper
                scrolls, the page never widens. */}
            <table className="w-full min-w-[560px] border-collapse text-sm">{children}</table>
        </div>
    ),
    thead: ({ children }: { children?: React.ReactNode }) => <thead className="bg-paper-deep">{children}</thead>,
    th: ({ children }: { children?: React.ReactNode }) => (
        <th className="border-b border-hairline px-4 py-2.5 text-left font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">{children}</th>
    ),
    td: ({ children }: { children?: React.ReactNode }) => (
        <td className="border-b border-hairline px-4 py-2.5 align-top leading-relaxed [overflow-wrap:anywhere]">{children}</td>
    ),
    // The plugin drops images; this keeps any survivor from reaching the DOM.
    img: () => null,
};

interface ReadmeProps {
    /** Vendored markdown, provenance comment included. */
    content: string;
    sha: string;
    /** The page head carries the contents line (see parseContents). */
    liftContents?: boolean;
}

/** The project README, GitHub chrome stripped, anchors and all. */
export function Readme({ content, sha, liftContents }: ReadmeProps) {
    return (
        <div className="readme-doc project-readme">
            <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, [rehypeProjectDoc, { sha, mode: "readme", liftContents }]]}
                components={components}
            >
                {content.replace(PROVENANCE, "")}
            </Markdown>
        </div>
    );
}

interface SkillBodyProps extends ReadmeProps {
    /** The skill's slug; prefixes heading ids so the three documents stay apart. */
    slug: string;
}

/** A SKILL.md body, headings demoted one level under the page's h1. */
export function SkillBody({ content, sha, slug }: SkillBodyProps) {
    return (
        <div className="readme-doc">
            <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, [rehypeProjectDoc, { sha, mode: "skill", idPrefix: slug }]]}
                components={components}
            >
                {parseSkill(content).body}
            </Markdown>
        </div>
    );
}
