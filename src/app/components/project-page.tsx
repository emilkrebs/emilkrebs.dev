import { readFileSync } from "fs";
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
 *
 * One document, one heading system: the README's own h2s are the page's
 * sections, so the page carries no mono "DEMO"/"README" wrapper labels on top
 * of them. The skills section is the only section this shell introduces, and
 * it is numbered in the same grammar.
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
        <article className="border border-hairline">
            <details className="group">
                <summary className="flex cursor-pointer list-none items-start gap-4 p-6 [&::-webkit-details-marker]:hidden">
                    <SkillIcon className="mt-1 size-7 shrink-0 text-ink" />
                    <span className="min-w-0 flex-1">
                        <span className="block font-mono text-sm font-medium tracking-tight">{slug}</span>
                        <span className="mt-2 block max-w-[62ch] text-sm leading-relaxed text-ink/85">
                            {description}
                        </span>
                    </span>
                    <span className="shrink-0 font-mono text-xs tracking-[0.04em] text-ink-soft">
                        <span className="group-open:hidden">{t.skillRead} <span aria-hidden="true">+</span></span>
                        <span className="hidden group-open:inline">{t.skillClose} <span aria-hidden="true">-</span></span>
                    </span>
                </summary>
                <div className="border-t border-hairline px-6 py-6">
                    {frontmatter.description && (
                        <p className="mb-6 max-w-[70ch] text-sm leading-relaxed text-ink/85">
                            {frontmatter.description}
                        </p>
                    )}
                    <SkillBody content={content} sha={meta.sha} slug={slug} />
                </div>
            </details>
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-hairline px-6 py-3">
                <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
                    {skillKilobytes(content)} KB
                </span>
                <a
                    href={`/downloads/${slug}.md`}
                    download
                    className="inline-flex items-center gap-2 font-medium hover:text-signal transition-colors duration-150"
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
    const spec = [
        { label: t.specVersion, value: meta.version },
        { label: t.specLicense, value: meta.license },
        { label: t.specSource, value: "emilkrebs/med-research-mcp", href: REPO_URL },
        { label: t.specSynced, value: meta.syncedAt.slice(0, 10) },
    ];
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

            {/* Head: the claim on the left, a mono spec block on the right. The
                block is what keeps the top from being a marketing hero with an
                empty half: every value in it comes from the vendored manifest. */}
            <section className="mx-auto max-w-280 px-6 pt-10 pb-10 md:pt-14 md:pb-12">
                <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-16">
                    <div>
                        <h1 className="text-[clamp(1.75rem,2.6vw,2.25rem)] font-bold leading-[1.05] tracking-[-0.03em]">
                            {PROJECT_NAME}
                        </h1>
                        <p className="mt-5 max-w-[62ch] text-base leading-relaxed md:text-lg">{lead}</p>
                        <div className="mt-6 flex flex-wrap items-center gap-x-6">
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
                    <dl className="grid grid-cols-2 gap-x-10 gap-y-5 md:pt-1">
                        {spec.map((item) => (
                            <div key={item.label}>
                                <dt className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
                                    {item.label}
                                </dt>
                                <dd className="mt-1 font-mono text-sm">
                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline decoration-hairline underline-offset-4 hover:text-signal hover:decoration-signal transition-colors duration-150"
                                        >
                                            {item.value}
                                        </a>
                                    ) : (
                                        item.value
                                    )}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            <section className="mx-auto max-w-280 border-t border-hairline px-6 py-10 md:py-12">
                <ProjectDemo locale={locale} alt={t.demoAlt} note={t.demoNote} />
            </section>

            <section className="mx-auto max-w-280 border-t border-hairline px-6 py-12 md:py-16">
                <div className="max-w-4xl">
                    <Readme content={readme[locale]} sha={meta.sha} />
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
                <div className="mt-8 flex flex-col gap-4">
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

            <section className="mx-auto max-w-280 border-t border-hairline px-6 py-10">
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