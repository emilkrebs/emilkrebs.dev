import { readFileSync, statSync } from "fs";
import { join } from "path";
import BackHeader from "./back-header";
import { JsonLd } from "./json-ld";
import { ProjectDemo } from "./project-demo";
import { parseSkill, Readme, SkillBody } from "./readme";
import { copy, type Locale, type ProjectPageCopy } from "../lib/i18n";
import type { OgImage } from "../lib/metadata";
import { projectPageSchema } from "../lib/structured-data";
import meta from "../content/projects/med-research-mcp/meta.json";

/**
 * The record page for med-research-mcp, shared by both locales. Everything
 * documentary is vendored at a pinned SHA by scripts/sync-project.mjs; this
 * shell only renders it. No third-party assets: not even the site analytics
 * script runs here (see components/analytics.tsx).
 */

const REPO = "emilkrebs/med-research-mcp";
const REPO_URL = `https://github.com/${REPO}`;
const PROJECT_NAME = "med-research-mcp";
const CONTENT_DIR = join(process.cwd(), "src/app/content/projects/med-research-mcp");
const MEDIA_DIR = join(process.cwd(), "public/pictures/projects/med-research-mcp");

const OUTBOUND_LINKS = [
    { label: "npm", href: "https://www.npmjs.com/package/med-research-mcp" },
    { label: "GitHub", href: REPO_URL },
    { label: "ModelScope", href: "https://www.modelscope.cn/mcp/servers/emilkrebs/med-research-mcp" },
];

const SKILL_SLUGS = ["med-research", "med-research-ebm", "med-research-setup"] as const;

const readme: Record<Locale, string> = {
    en: readFileSync(join(CONTENT_DIR, "readme.en.md"), "utf8"),
    zh: readFileSync(join(CONTENT_DIR, "readme.zh.md"), "utf8"),
};
const skillFiles = Object.fromEntries(
    SKILL_SLUGS.map((slug) => [slug, readFileSync(join(CONTENT_DIR, `skill-${slug}.md`), "utf8")]),
);
const gifBytes: Record<Locale, number> = {
    en: statSync(join(MEDIA_DIR, "med-research-mcp-demo.gif")).size,
    zh: statSync(join(MEDIA_DIR, "med-research-mcp-demo-zh.gif")).size,
};

/** The one-sentence lead, shared with the landing card so they cannot drift. */
export function projectLead(locale: Locale): string {
    const project = copy[locale].projects.find((candidate) => candidate.id === PROJECT_NAME);
    if (!project) throw new Error(`Missing landing copy for project "${PROJECT_NAME}"`);
    return project.description;
}

export function projectOgImage(locale: Locale): OgImage {
    return { url: "/og/med-research-mcp.jpg", width: 1200, height: 630, alt: projectLead(locale) };
}

function SectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft mb-10">
            {children}
        </h2>
    );
}

/** The project's skill mark, in site ink: decoration, no accessible name. */
function SkillIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 62 62"
            fill="none"
            stroke="currentColor"
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M23.746,61.44l-0.634,-20.621m0,0l-7.017,-11.089" />
            <path d="M32.621,26.077l0,-10.742m0,10.742l-9.603,-3.322m9.603,3.322l-9.545,13.973m9.545,-13.973l5.938,8.693m-5.938,-8.693l9.603,-3.322" />
        </svg>
    );
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
        <article className="border border-hairline bg-paper-deep">
            <details className="group">
                <summary className="flex cursor-pointer list-none items-start gap-4 p-6 md:p-8 [&::-webkit-details-marker]:hidden">
                    <SkillIcon className="mt-1 size-8 shrink-0 text-ink" />
                    <span className="min-w-0 flex-1">
                        <span className="block text-xl md:text-2xl font-semibold tracking-tight">{slug}</span>
                        <span className="mt-2 block text-sm md:text-base leading-relaxed text-ink/85">
                            {description}
                        </span>
                    </span>
                    <span className="shrink-0 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
                        <span className="group-open:hidden">{t.skillRead} <span aria-hidden="true">+</span></span>
                        <span className="hidden group-open:inline">{t.skillClose} <span aria-hidden="true">-</span></span>
                    </span>
                </summary>
                <div className="border-t border-hairline px-6 py-6 md:px-8">
                    {frontmatter.description && (
                        <p className="mb-6 max-w-[70ch] text-sm leading-relaxed text-ink/85">
                            {frontmatter.description}
                        </p>
                    )}
                    <SkillBody content={content} sha={meta.sha} slug={slug} />
                </div>
            </details>
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-hairline px-6 py-4 md:px-8">
                <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
                    SKILL.md - {skillKilobytes(content)} KB
                </span>
                <a
                    href={`/downloads/${slug}.zip`}
                    download
                    className="inline-flex items-center gap-2 font-medium hover:text-signal transition-colors duration-150"
                >
                    {t.skillDownload.replace("{file}", `${slug}.zip`)}
                    <span className="text-signal" aria-hidden="true">↓</span>
                </a>
            </div>
        </article>
    );
}

export function ProjectPage({ locale }: { locale: Locale }) {
    const t = copy[locale].projectPage;
    const lead = projectLead(locale);
    const statusLine = t.statusLine.replace("{version}", meta.version).replace("{license}", meta.license);
    const playLabel = t.demoPlay.replace("{size}", `${(gifBytes[locale] / 2 ** 20).toFixed(1)} MB`);
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

            <section className="mx-auto max-w-280 px-6 pt-10 md:pt-16 pb-16 md:pb-20">
                <p className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">{statusLine}</p>
                <h1 className="mt-4 font-bold tracking-[-0.03em] leading-[0.95] text-[clamp(2rem,4.5vw,3.25rem)]">
                    {PROJECT_NAME}
                </h1>
                <p className="mt-6 max-w-[62ch] text-base md:text-lg leading-relaxed">{lead}</p>
                <div className="mt-8 flex flex-wrap items-center gap-x-6">
                    {OUTBOUND_LINKS.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 py-2.5 font-medium hover:text-signal transition-colors duration-150"
                        >
                            {link.label}
                            <span className="text-signal" aria-hidden="true">→</span>
                        </a>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-280 px-6 py-16 md:py-20 border-t border-hairline">
                <SectionHeading>{t.demoHeading}</SectionHeading>
                <ProjectDemo
                    locale={locale}
                    alt={t.demoAlt}
                    playLabel={playLabel}
                    stopLabel={t.demoStop}
                    note={t.demoNote}
                    noscript={t.demoNoscript}
                />
            </section>

            <section className="mx-auto max-w-280 px-6 py-16 md:py-20 border-t border-hairline">
                <SectionHeading>{t.readmeHeading}</SectionHeading>
                <div className="max-w-4xl">
                    <Readme content={readme[locale]} sha={meta.sha} />
                </div>
            </section>

            <section className="mx-auto max-w-280 px-6 py-16 md:py-20 border-t border-hairline">
                <SectionHeading>{t.skillsHeading}</SectionHeading>
                <p className="max-w-[62ch] text-base md:text-lg leading-relaxed">{t.skillsLead}</p>
                <div className="mt-10 flex max-w-4xl flex-col gap-6">
                    {SKILL_SLUGS.map((slug) => (
                        <SkillCard
                            key={slug}
                            slug={slug}
                            description={t.skills.find((skill) => skill.id === slug)?.description ?? ""}
                            t={t}
                        />
                    ))}
                </div>
                <a
                    href="/downloads/med-research-skills.zip"
                    download
                    className="mt-8 inline-flex items-center gap-2 py-2.5 font-medium hover:text-signal transition-colors duration-150"
                >
                    {t.bundleDownload}
                    <span className="text-signal" aria-hidden="true">↓</span>
                </a>
            </section>

            <section className="mx-auto max-w-280 px-6 py-10 border-t border-hairline">
                <p className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
                    {t.provenanceLabel}: {t.provenanceRendered}{" "}
                    <a
                        href={`${REPO_URL}/commit/${meta.sha}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink underline decoration-hairline underline-offset-4 hover:text-signal hover:decoration-signal transition-colors duration-150"
                    >
                        {REPO}@{meta.sha.slice(0, 7)}
                    </a>
                    {" - "}{t.provenanceSynced} {meta.syncedAt.slice(0, 10)}
                </p>
            </section>
        </main>
    );
}
