import Image from "next/image";
import { PlaceholderPlate } from "./placeholder-plate";
import { PreviewConsent } from "./preview-consent";
import { ExternalNotice } from "./external-notice";
import { LocaleSwitcher } from "./locale-switcher";
import { EMAIL_ADDRESS, GITHUB_URL, LINKEDIN_URL } from "../lib/constants";
import { copy, type LandingCopy, type Locale, type ProjectCopy } from "../lib/copy";

function generatePersonJsonLd(locale: Locale) {
    return {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Emil Krebs",
        "jobTitle": "Software Engineer",
        "description": copy[locale].jsonLd.personDescription,
        "url": "https://emilkrebs.dev",
        "image": "https://emilkrebs.dev/pictures/portrait.webp",
        "sameAs": [
            "https://github.com/emilkrebs",
            "https://linkedin.com/in/emilkrebs",
        ],
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Kiel",
            "addressCountry": "Germany",
        },
        "worksFor": {
            "@type": "Organization",
            "name": "TypeFox GmbH",
            "url": "https://typefox.io",
        },
        "knowsAbout": [
            "Software Engineering",
            "Language Server Protocol",
            "Langium",
            "Theia",
            "Developer Tools",
            "TypeScript",
            "Kotlin",
            "Open Source",
            "Spaced Repetition",
            "Health Optimization",
        ],
        "alumniOf": {
            "@type": "Organization",
            "name": "Kiel University",
            "sameAs": "https://www.uni-kiel.de/en/"
        },
    };
}

function generateWebsiteJsonLd(locale: Locale) {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": copy[locale].jsonLd.websiteName,
        "description": copy[locale].jsonLd.websiteDescription,
        "url": "https://emilkrebs.dev",
        "author": {
            "@type": "Person",
            "name": "Emil Krebs",
        },
        "inLanguage": locale === "zh" ? "zh-CN" : "en-US",
        "copyrightHolder": {
            "@type": "Person",
            "name": "Emil Krebs",
        },
    };
}

interface ProjectBase {
    id: string;
    href?: string;
    tags: string[];
    flagship?: boolean;
    image?: string;
    placeholder?: string;
    preview?: string;
    consent?: boolean;
    notice?: boolean;
}

type Project = ProjectBase & ProjectCopy;

const FLAGSHIP_BASE: ProjectBase[] = [
    {
        id: "prami",
        href: "https://prami.app",
        tags: ["Next.js", "PWA", "TypeScript"],
        flagship: true,
        image: "/pictures/prami.webp",
        notice: true,
    },
    {
        id: "healthstack",
        href: "/healthstack",
        tags: ["Theia", "Langium", "TypeScript", "Electron"],
        flagship: true,
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
        consent: true,
    },
    {
        id: "this-site",
        href: "/",
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

function TokenMark({ count = 16 }: { count?: number }) {
    return (
        <div
            className="flex gap-2.5"
            aria-hidden="true"
        >
            {Array.from({ length: count }).map((_, i) => (
                <span
                    key={i}
                    className="size-1.5 bg-signal"
                />
            ))}
        </div>
    );
}

function Nav({ t }: { t: LandingCopy }) {
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
                    {t.nav.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="py-2 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft hover:text-ink transition-colors duration-150"
                        >
                            {item.label}
                        </a>
                    ))}
                    {t.switcher && (
                        <LocaleSwitcher
                            href={t.switcher.href}
                            label={t.switcher.label}
                            aria={t.switcher.aria}
                            pref={t.switcher.pref}
                        />
                    )}
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
                            width={512}
                            height={512}
                            priority
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
                <TokenMark />
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
                        className="typefox-logo"
                    />
                </h3>
                <p className="mt-4 text-base md:text-lg leading-relaxed max-w-[60ch]">
                    {t.workBlurb}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="border border-hairline px-2 py-1 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ProjectCard({ project, t }: { project: Project; t: LandingCopy }) {
    return (
        <article className="bg-paper-deep border border-hairline flex flex-col group hover:border-ink transition-colors duration-150">
            {project.preview && (
                <div className="relative">
                    <div className="relative aspect-16/10 border-b border-hairline overflow-hidden bg-paper">
                        {project.consent ? (
                            <PreviewConsent
                                id={`consent-${project.id}`}
                                src={project.preview}
                                title={`${project.name}${t.previewTitleSuffix}`}
                                placeholder={project.placeholder}
                                copy={t.consent}
                            />
                        ) : (
                            <iframe
                                src={project.preview}
                                title={`${project.name}${t.previewTitleSuffix}`}
                                loading="lazy"
                                referrerPolicy="no-referrer"
                                className="size-full border-0"
                            />
                        )}
                    </div>
                    <p className="px-8 pt-3 font-mono text-xs uppercase tracking-[0.08em] text-ink/75">
                        {project.previewCaption}
                    </p>
                </div>
            )}
            {!project.preview && (project.image || project.placeholder) && (
                <div className="relative">
                    <div className="relative aspect-16/10 border-b border-hairline overflow-hidden bg-paper">
                        {project.image ? (
                            <Image
                                src={project.image}
                                alt={`${project.name}${t.screenshotAltSuffix}`}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover object-top"
                            />
                        ) : (
                            <PlaceholderPlate label={project.placeholder ?? ""} />
                        )}
                    </div>
                    <p className="px-8 pt-3 font-mono text-xs uppercase tracking-[0.08em] text-ink/75">
                        {project.imageCaption}
                    </p>
                </div>
            )}
            <div className="p-8 md:p-10 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-4">
                    <h3
                        className={`${project.flagship ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"} font-semibold tracking-tight`}
                    >
                        {project.name}
                    </h3>
                    {project.status && (
                        <span className="inline-flex items-center gap-2 border border-hairline px-2 py-1 font-mono text-xs uppercase tracking-[0.08em] whitespace-nowrap">
                            <span className="size-1.5 bg-signal" aria-hidden="true" />
                            {project.status}
                        </span>
                    )}
                </div>
                <p className="mt-4 text-base leading-relaxed text-ink/85 flex-1 max-w-[62ch]">
                    {project.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                        <span
                            key={tag}
                            className="border border-hairline px-2 py-1 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="mt-8">
                    {project.href ? (
                        project.notice ? (
                            <ExternalNotice
                                href={project.href}
                                title={project.name}
                                copy={t.externalNotice}
                            />
                        ) : (
                            <a
                                href={project.href}
                                target={project.href.startsWith("http") ? "_blank" : undefined}
                                rel={project.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                className="inline-flex items-center gap-2 font-medium group-hover:text-signal transition-colors duration-150"
                            >
                                {t.open}
                                <span className="text-signal" aria-hidden="true">→</span>
                            </a>
                        )
                    ) : (
                        <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
                            {t.privateLabel}
                        </span>
                    )}
                </div>
            </div>
        </article>
    );
}

function Projects({ t }: { t: LandingCopy }) {
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
                    <ProjectCard key={project.id} project={project} t={t} />
                ))}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project, index) => (
                    <div
                        key={project.id}
                        className={
                            index % 3 === 0 || index === projects.length - 1
                                ? "md:col-span-2"
                                : ""
                        }
                    >
                        <ProjectCard project={project} t={t} />
                    </div>
                ))}
            </div>
        </section>
    );
}

export function Landing({ locale }: { locale: Locale }) {
    const t = copy[locale];
    const personJsonLd = generatePersonJsonLd(locale);
    const websiteJsonLd = generateWebsiteJsonLd(locale);

    return (
        <main id="main">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
            />
            <Nav t={t} />
            <Hero t={t} />
            <Field t={t} />
            <WhatIDo t={t} />
            <Work t={t} />
            <Projects t={t} />
        </main>
    );
}
