import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "./json-ld";
import { ProjectCard } from "./project-card";
import { RouteLocaleSwitcher } from "./route-locale-switcher";
import { Tag } from "./tag";
import { TokenMark } from "./token-mark";
import { EMAIL_ADDRESS, GITHUB_URL, LINKEDIN_URL } from "../lib/constants";
import { copy, type LandingCopy, type Locale, type ProjectCopy } from "../lib/i18n";
import { routePath, type RouteKey } from "../lib/routes";
import { profilePageSchema } from "../lib/structured-data";

interface ProjectBase {
    id: string;
    /** External URL. */
    href?: string;
    /** Internal page, linked in the current locale. */
    route?: RouteKey;
    tags: string[];
    image?: string;
    placeholder?: string;
    preview?: string;
    notice?: boolean;
}

type Project = ProjectBase & ProjectCopy;

// Card widths in the 1120px container (1072px of content), for srcset selection.
const FULL_WIDTH_SIZES = "(min-width: 1120px) 1072px, 100vw";
const HALF_WIDTH_SIZES = "(min-width: 1120px) 524px, (min-width: 768px) 50vw, 100vw";

const FLAGSHIP_BASE: ProjectBase[] = [
    {
        id: "prami",
        href: "https://prami.app",
        tags: ["Next.js", "PWA", "TypeScript"],
        image: "/pictures/prami.webp",
        notice: true,
    },
    {
        id: "healthstack",
        route: "healthstack",
        tags: ["Theia", "Langium", "TypeScript", "Electron"],
        image: "/pictures/healthstack-dashboard.webp",
    },
];

const PROJECT_BASE: ProjectBase[] = [
    {
        id: "vailnote",
        href: "https://vailnote.com/",
        tags: ["TypeScript", "Fresh", "Deno", "MongoDB"],
        image: "/pictures/vailnote.webp",
    },
    {
        id: "watchlock",
        href: "https://github.com/emilkrebs/WatchLock",
        tags: ["Kotlin", "Android", "WearOS"],
        image: "/pictures/watchlock.webp",
    },
    {
        id: "bipoc",
        href: "https://bipoclimatejusticenetwork.org/",
        tags: ["Next.js", "TypeScript", "Localization"],
        image: "/pictures/bipoc.webp",
    },
    {
        id: "langium-showcase",
        href: "https://langium.org/showcase/",
        tags: ["Langium", "TypeScript", "DSLs"],
        preview: "https://langium.org/showcase/minilogo/",
        placeholder: "/pictures/langium-placeholder.png",
    },
    {
        id: "this-site",
        route: "home",
        tags: ["Next.js", "TypeScript", "Tailwind CSS"],
        image: "/pictures/this-site.webp",
    },
];

function mergeProjects(base: ProjectBase[], copies: ProjectCopy[]): Project[] {
    return base.map((project) => {
        const projectCopy = copies.find((c) => c.id === project.id);
        if (!projectCopy) {
            throw new Error(`Missing landing copy for project "${project.id}"`);
        }
        return { ...project, ...projectCopy };
    });
}

function Nav({ t, locale }: { t: LandingCopy; locale: Locale }) {
    const linkClass = "py-2 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft hover:text-ink transition-colors duration-150";
    return (
        <nav aria-label={t.navAria} className="sticky top-0 z-50 bg-paper border-b border-hairline">
            <div className="mx-auto flex items-center justify-between max-w-280 px-4 md:px-6 h-16">
                <a
                    href="#top"
                    className="font-semibold tracking-tight text-lg"
                >
                    emil<span className="text-signal">.</span>krebs
                </a>
                <div className="flex items-center gap-4 md:gap-8">
                    <Link href={routePath("story", locale)} className={linkClass}>
                        {t.nav.story}
                    </Link>
                    <a href="#work" className={linkClass}>
                        {t.nav.work}
                    </a>
                    <a href="#projects" className={linkClass}>
                        {t.nav.projects}
                    </a>
                    <RouteLocaleSwitcher route="home" locale={locale} />
                </div>
            </div>
        </nav>
    );
}

function Hero({ t }: { t: LandingCopy }) {
    return (
        <section
            id="top"
            className="mx-auto max-w-280 px-6 pt-16 md:pt-24 pb-16 md:pb-20"
        >
            <div className="flex flex-col-reverse md:flex-row md:items-start justify-between gap-12 md:gap-20">
                <div className="max-w-160">
                    <h1 className="font-bold tracking-[-0.03em] leading-[0.95] text-[clamp(3rem,8vw,6.5rem)]">
                        Emil Krebs
                    </h1>
                    <p className="mt-8 text-lg md:text-xl leading-relaxed max-w-[46ch]">
                        {t.heroTagline}
                    </p>
                    <div className="mt-10 flex flex-wrap items-center gap-6">
                        <a
                            href={GITHUB_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 font-medium hover:text-signal transition-colors duration-150"
                        >
                            {t.ctas.github}
                            <span className="text-signal" aria-hidden="true">→</span>
                        </a>
                        <a
                            href={LINKEDIN_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 font-medium hover:text-signal transition-colors duration-150"
                        >
                            {t.ctas.linkedin}
                            <span className="text-signal" aria-hidden="true">→</span>
                        </a>
                        <a
                            href={`mailto:${EMAIL_ADDRESS}`}
                            className="inline-flex items-center gap-2 font-medium hover:text-signal transition-colors duration-150"
                        >
                            {t.ctas.email}
                            <span className="text-signal" aria-hidden="true">→</span>
                        </a>
                    </div>
                </div>

                <figure className="shrink-0 relative w-fit">
                    <span className="absolute inset-0 border border-signal opacity-70" aria-hidden="true">
                        <span
                            className="absolute -top-1.5 -left-1.5 size-3.5 border-t-2 border-l-2 border-signal"
                            aria-hidden="true"
                        />
                        <span
                            className="absolute -top-1.5 -right-1.5 size-3.5 border-t-2 border-r-2 border-signal"
                            aria-hidden="true"
                        />
                        <span
                            className="absolute -bottom-1.5 -left-1.5 size-3.5 border-b-2 border-l-2 border-signal"
                            aria-hidden="true"
                        />
                        <span
                            className="absolute -bottom-1.5 -right-1.5 size-3.5 border-b-2 border-r-2 border-signal"
                            aria-hidden="true"
                        />
                    </span>
                    <div className="duotone-frame relative size-44 md:size-56 border border-ink-soft/50 overflow-hidden">
                        <Image
                            src="/pictures/portrait.webp"
                            alt={t.portraitAlt}
                            width={224}
                            height={224}
                            preload
                            className="absolute inset-0 size-full object-cover"
                        />

                        <div className="absolute inset-0" aria-hidden="true" />
                        <div className="absolute left-1/2 top-[36%] h-28 w-24 -translate-x-1/2 -translate-y-1/2 border border-signal-accent/70 hover:border-signal-accent/5 transition-colors" aria-hidden="true">
                            <div className="duotone-tint absolute inset-0" />
                            <div className="duotone-lift absolute inset-0" />
                        </div>
                    </div>
                    <div
                        className="absolute -top-2.5 -right-2.5 z-20 bg-paper border border-signal-accent/60 px-2.5 py-1.5"
                        role="status"
                    >
                        <p className="font-mono text-[10px] uppercase tracking-[0.08em] leading-tight">
                            <span className="block text-ink-soft">{t.thinking}</span>
                        </p>
                    </div>
                </figure>
            </div>

            <div className="mt-16 md:mt-20">
                <TokenMark count={16} />
            </div>
        </section>
    );
}

function SectionHeading({ id, children }: { id?: string; children: string }) {
    return (
        <h2
            id={id}
            className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.01em] mb-10"
        >
            {children}
        </h2>
    );
}

function Field({ t }: { t: LandingCopy }) {
    return (
        <section
            id="field"
            className="mx-auto max-w-280 px-6 py-16 md:py-24 border-t border-hairline"
        >
            <SectionHeading>{t.fieldHeading}</SectionHeading>
            <p className="text-xl md:text-2xl leading-relaxed max-w-[64ch]">
                {t.fieldLead[0]}
                <i className="mx-1">TypeFox</i>
                {t.fieldLead[1]}
            </p>
        </section>
    );
}

function WhatIDo({ t }: { t: LandingCopy }) {
    return (
        <section className="mx-auto max-w-280 px-6 py-16 md:py-24 border-t border-hairline">
            <SectionHeading>{t.strengthsHeading}</SectionHeading>
            <div className="flex flex-col gap-20 md:gap-24">
                {t.strengths.map((strength) => (
                    <div
                        key={strength.title}
                        className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8"
                    >
                        <h3 className="md:col-span-4 text-2xl md:text-3xl font-semibold tracking-tight flex items-start gap-3">
                            <span className="mt-3 size-1.5 bg-signal shrink-0" aria-hidden="true" />
                            {strength.title}
                        </h3>
                        <p className="md:col-span-8 text-base md:text-lg leading-relaxed text-ink/85 max-w-[52ch]">
                            {strength.proof}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function Work({ t }: { t: LandingCopy }) {
    const tags = ["TypeScript", "LSP", "Langium", "Theia", "Node.js"];
    return (
        <section
            id="work"
            className="mx-auto max-w-280 px-6 py-16 md:py-24 border-t border-hairline"
        >
            <SectionHeading>{t.workHeading}</SectionHeading>
            <div className="bg-paper-deep border border-hairline p-8 md:p-12">
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
                    {/* TypeFox GmbH */}
                    <Image
                        src="/pictures/typefox-logo.svg"
                        alt="TypeFox GmbH"
                        width={11813}
                        height={2600}
                        unoptimized
                        className="typefox-logo"
                    />
                </h3>
                <p className="mt-4 text-base md:text-lg leading-relaxed max-w-[60ch]">
                    {t.workBlurb}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                    ))}
                </div>
            </div>
        </section>
    );
}

interface ProjectEntryProps {
    project: Project;
    locale: Locale;
    flagship?: boolean;
    wide?: boolean;
}

function ProjectEntry({ project, locale, flagship, wide }: ProjectEntryProps) {
    return (
        <ProjectCard
            name={project.name}
            description={project.description}
            status={project.status}
            caption={project.caption}
            tags={project.tags}
            href={project.route ? routePath(project.route, locale) : project.href}
            notice={project.notice}
            image={project.image}
            preview={project.preview}
            placeholder={project.placeholder}
            variant={flagship ? "flagship" : undefined}
            sizes={wide ? FULL_WIDTH_SIZES : HALF_WIDTH_SIZES}
            locale={locale}
        />
    );
}

function Projects({ t, locale }: { t: LandingCopy; locale: Locale }) {
    const flagships = mergeProjects(FLAGSHIP_BASE, t.flagships);
    const projects = mergeProjects(PROJECT_BASE, t.projects);
    return (
        <section
            id="projects"
            className="mx-auto max-w-280 px-6 py-16 md:py-24 border-t border-hairline"
        >
            <SectionHeading>{t.projectsHeading}</SectionHeading>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {flagships.map((project) => (
                    <ProjectEntry key={project.id} project={project} locale={locale} flagship />
                ))}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project, index) => {
                    const wide = index % 3 === 0 || index === projects.length - 1;
                    return (
                        <div key={project.id} className={wide ? "md:col-span-2" : ""}>
                            <ProjectEntry project={project} locale={locale} wide={wide} />
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export function Landing({ locale }: { locale: Locale }) {
    const t = copy[locale];

    return (
        <main id="main">
            <JsonLd data={profilePageSchema(locale)} />
            <Nav t={t} locale={locale} />
            <Hero t={t} />
            <Field t={t} />
            <WhatIDo t={t} />
            <Work t={t} />
            <Projects t={t} locale={locale} />
        </main>
    );
}
