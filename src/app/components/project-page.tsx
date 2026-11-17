import { readFileSync } from "fs";
import { join } from "path";
import BackHeader from "./back-header";
import { JsonLd } from "./json-ld";
import { ProjectDemo } from "./project-demo";
import { parseSkill, parseContents, Readme, SkillBody } from "./readme";
import { copy, type Locale, type ProjectPageCopy } from "../lib/i18n";
import type { OgImage } from "../lib/metadata";
import { projectPageSchema } from "../lib/structured-data";
import meta from "../content/projects/med-research-mcp/meta.json";

/**
 * The record page for med-research-mcp, shared by both locales. Everything
 * documentary is vendored at a pinned SHA by scripts/sync-project.mjs; this
 * shell only renders it. No third-party assets: not even the site analytics
 * script runs here (see components/analytics.tsx).
 *
 * One document, one heading system: the README's own h2s are the page's
 * sections, so the page carries no mono "DEMO"/"README" wrapper labels on top
 * of them. The skills section is the only section this shell introduces, and
 * it is numbered in the same grammar.
 *
 * The head answers the first three questions in order: what is this (the
 * lead), how do I run it (the one-command strip), where is everything (the
 * README's own contents line, lifted here with its localized labels). The
 * version-and-license line and the outbound exits close the head quietly.
 */

const REPO = "emilkrebs/med-research-mcp";
const REPO_URL = `https://github.com/${REPO}`;
const PROJECT_NAME = "med-research-mcp";
const CONTENT_DIR = join(process.cwd(), "src/app/content/projects/med-research-mcp");

const OUTBOUND_LINKS = [
    { label: "npm", href: "https://www.npmjs.com/package/med-research-mcp" },
    { label: "GitHub", href: REPO_URL },
    { label: "ModelScope", href: "https://www.modelscope.cn/mcp/servers/emilkrebs/med-research-mcp" },
];

const SKILL_SLUGS = ["med-research", "med-research-ebm", "med-research-setup"] as const;

/** The README's own "Agent skills" heading slug, per locale. */
const SKILLS_ANCHOR: Record<Locale, string> = {
    en: "agent-skills",
    zh: "智能体技能",
};

/** The README's install heading slug, per locale; the head's strip links to it. */
const INSTALL_ANCHOR: Record<Locale, string> = {
    en: "install",
    zh: "安装",
};

/** The command every MCP client configuration runs; identical in both locales. */
const INSTALL_COMMAND = "npx -y med-research-mcp";

const readme: Record<Locale, string> = {
    en: readFileSync(join(CONTENT_DIR, "readme.en.md"), "utf8"),
    zh: readFileSync(join(CONTENT_DIR, "readme.zh.md"), "utf8"),
};
const skillFiles = Object.fromEntries(
    SKILL_SLUGS.map((slug) => [slug, readFileSync(join(CONTENT_DIR, `skill-${slug}.md`), "utf8")]),
);

/** The one-sentence lead, shared with the landing card so they cannot drift. */
export function projectLead(locale: Locale): string {
    const project = copy[locale].projects.find((candidate) => candidate.id === PROJECT_NAME);
    if (!project) throw new Error(`Missing landing copy for project "${PROJECT_NAME}"`);
    return project.description;
}

export function projectOgImage(locale: Locale): OgImage {
    return { url: "/og/med-research-mcp.jpg", width: 1200, height: 630, alt: projectLead(locale) };
}

/** Upstream byte size of a vendored SKILL.md (the provenance line is ours). */
function skillKilobytes(content: string): string {
    const bytes = Buffer.byteLength(content) - (content.indexOf("\n") + 1);
    return (bytes / 1000).toFixed(1);
}

interface SkillCardProps {
    slug: (typeof SKILL_SLUGS)[number];
    description: string;
    t: ProjectPageCopy;
}

function SkillCard({ slug, description, t }: SkillCardProps) {
    const content = skillFiles[slug];
    const frontmatter = parseSkill(content);
    return (
        <article className="flex h-full flex-col border border-hairline md:[&:has(details[open])]:col-span-3">
            <details className="group flex-1">
                <summary className="flex cursor-pointer list-none flex-col p-5 [&::-webkit-details-marker]:hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element -- the skill mark keeps its own colour; an inline SVG would inherit the ink */}
                    <img
                        src="/pictures/med-research-skills.svg"
                        alt=""
                        aria-hidden="true"
                        width={24}
                        height={24}
                        className="size-6"
                    />
                    <span className="mt-4 block text-base font-semibold">{slug}</span>
                    <span className="mt-2 block text-sm leading-relaxed text-ink/85">{description}</span>
                    <span className="mt-4 block font-mono text-xs tracking-[0.04em] text-ink-soft">
                        <span className="group-open:hidden">{t.skillRead} <span aria-hidden="true">+</span></span>
                        <span className="hidden group-open:inline">{t.skillClose} <span aria-hidden="true">-</span></span>
                    </span>
                </summary>
                <div className="border-t border-hairline px-5 py-5">
                    {frontmatter.description && (
                        <p className="mb-6 max-w-[70ch] text-sm leading-relaxed text-ink/85">
                            {frontmatter.description}
                        </p>
                    )}
                    <SkillBody content={content} sha={meta.sha} slug={slug} />
                </div>
            </details>
            <div className="mt-auto flex items-center justify-between gap-x-4 border-t border-hairline px-5 py-3">
                <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
                    {skillKilobytes(content)} KB
                </span>
                <a
                    href={`/downloads/${slug}.md`}
                    download
                    className="inline-flex items-center gap-2 text-sm font-medium hover:text-signal transition-colors duration-150"
                >
                    {t.skillDownload}
                    <span className="text-signal" aria-hidden="true">↓</span>
                </a>
            </div>
        </article>
    );
}

export function ProjectPage({ locale }: { locale: Locale }) {
    const t = copy[locale].projectPage;
    const lead = projectLead(locale);
    const contents = parseContents(readme[locale]);
    return (
        <main id="main" className="flex-1">
            <JsonLd
                data={projectPageSchema({
                    route: "project_med_research",
                    locale,
                    name: PROJECT_NAME,
                    description: lead,
                    image: "/og/med-research-mcp.jpg",
                })}
            />
            <BackHeader route="project_med_research" locale={locale} />

            {/* Head: the mark and the claim, then the one command that runs
                the server, then the README's own contents line as a jump row
                (its labels are the vendored README's, already localized).
                Version, license and the outbound exits close the head on one
                quiet row. The mark is the project's own, and it is the first
                thing a returning reader recognises. */}
            <section className="mx-auto max-w-280 px-6 pt-10 pb-10 md:pt-14 md:pb-12">
                <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element -- brand mark: an SVG that must keep its own colours */}
                    <img
                        src="/pictures/med-research-mcp.svg"
                        alt=""
                        aria-hidden="true"
                        width={48}
                        height={48}
                        className="size-12 shrink-0"
                    />
                    <h1 className="text-[clamp(1.75rem,2.6vw,2.25rem)] font-bold leading-[1.05] tracking-[-0.03em]">
                        {PROJECT_NAME}
                    </h1>
                </div>
                <p className="mt-5 max-w-[62ch] text-base leading-relaxed md:text-lg">{lead}</p>

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border border-hairline bg-paper-deep px-4 py-3 md:px-5">
                    <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
                        {t.installLabel}
                    </span>
                    <code className="font-mono text-sm [overflow-wrap:anywhere]">{INSTALL_COMMAND}</code>
                    <a
                        href={`#${INSTALL_ANCHOR[locale]}`}
                        className="inline-flex items-center gap-2 text-sm font-medium hover:text-signal transition-colors duration-150 md:ml-auto"
                    >
                        {t.installGuide}
                        <span className="text-signal" aria-hidden="true">→</span>
                    </a>
                </div>

                {contents.length > 0 && (
                    <nav
                        aria-label={t.contentsAria}
                        className="mt-6 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs uppercase tracking-[0.08em] text-ink/75"
                    >
                        {contents.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="py-1 hover:text-signal transition-colors duration-150"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                )}

                <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
                    <span className="font-mono text-xs tracking-[0.08em] text-ink-soft">
                        v{meta.version} · {meta.license}
                    </span>
                    <div className="flex flex-wrap items-center gap-x-6 md:ml-auto">
                        {OUTBOUND_LINKS.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 py-2 font-medium hover:text-signal transition-colors duration-150"
                            >
                                {link.label}
                                <span className="text-signal" aria-hidden="true">→</span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-280 border-t border-hairline px-6 py-10 md:py-12">
                <ProjectDemo locale={locale} alt={t.demoAlt} note={t.demoNote} />
            </section>

            <section className="mx-auto max-w-280 border-t border-hairline px-6 py-12 md:py-16">
                <div className="max-w-4xl">
                    <Readme content={readme[locale]} sha={meta.sha} liftContents={contents.length > 0} />
                </div>
            </section>

            <section className="mx-auto max-w-280 border-t border-hairline px-6 py-12 md:py-16">
                <h2
                    id={SKILLS_ANCHOR[locale]}
                    className="mb-4 text-2xl font-semibold leading-snug tracking-tight md:text-3xl"
                >
                    {t.skillsHeading}
                </h2>
                <p className="max-w-[62ch] text-base leading-relaxed md:text-lg">{t.skillsLead}</p>
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {SKILL_SLUGS.map((slug) => (
                        <SkillCard
                            key={slug}
                            slug={slug}
                            description={t.skills.find((skill) => skill.id === slug)?.description ?? ""}
                            t={t}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}