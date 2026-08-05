import Image from "next/image";
import { PlaceholderPlate } from "./components/placeholder-plate";
import { PreviewConsent } from "./components/preview-consent";
import { ExternalNotice } from "./components/external-notice";
import { EMAIL_ADDRESS, GITHUB_URL, LINKEDIN_URL } from "./lib/constants";

function generatePersonJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Emil Krebs",
        "jobTitle": "Software Engineer",
        "description":
            "Software engineer at TypeFox GmbH from Kiel, Germany, building language servers, DSLs, and products like Prami and Healthstack. Everything ships open source.",
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

function generateWebsiteJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Emil Krebs - Software engineer in Kiel",
        "description":
            "Personal website of Emil Krebs, a Software engineer at TypeFox GmbH from Kiel, Germany, building language servers, DSLs, and products like Prami and Healthstack.",
        "url": "https://emilkrebs.dev",
        "author": {
            "@type": "Person",
            "name": "Emil Krebs",
        },
        "inLanguage": "en-US",
        "copyrightHolder": {
            "@type": "Person",
            "name": "Emil Krebs",
        },
    };
}

const NAV = [
    { href: "#field", label: "Field" },
    { href: "#work", label: "Work" },
    { href: "#projects", label: "Projects" },
];

const STRENGTHS = [

    {
        title: "Developer tooling",
        proof:
            "Language servers, the LSP, Langium DSLs, Theia-based IDEs, and generators — the domain-specific tools that let editors understand code.",
    },
    {
        title: "Security & privacy",
        proof:
            "Zero-knowledge encryption in VailNote, WearOS locking in WatchLock, no telemetry by default.",
    },
    {
        title: "Open source",
        proof:
            "The Langium showcase, Theia, the Fresh ecosystem, and the BIPoC Climate Justice conference site.",
    },
];

interface Project {
    name: string;
    description: string;
    href?: string;
    status?: string;
    tags: string[];
    flagship?: boolean;
    image?: string;
    imageCaption?: string;
    placeholder?: string;
    preview?: string;
    previewCaption?: string;
    consent?: boolean;
    notice?: boolean;
}

const FLAGSHIP_PROJECTS: Project[] = [
    {
        name: "Prami",
        description:
            "Active recall and spaced repetition, engineered so the review schedule fades into the background.",
        href: "https://prami.app",
        status: "Preview",
        tags: ["Next.js", "PWA", "TypeScript"],
        flagship: true,
        image: "/pictures/prami.webp",
        imageCaption: "In testing - Prami",
        notice: true,
    },
    {
        name: "Healthstack",
        description:
            "A specialized IDE for health optimization on Eclipse Theia: biomarker tracking, unit conversion, and a purpose-built DSL for intervention protocols.",
        href: "/healthstack",
        status: "Preview",
        tags: ["Theia", "Langium", "TypeScript", "Electron"],
        flagship: true,
        image: "/pictures/healthstack-dashboard.webp",
        imageCaption: "Dev build - biomarker dashboard",
    },
];

const PROJECTS: Project[] = [
    {
        name: "VailNote",
        description:
            "Encrypted note sharing with zero-knowledge encryption and self-destructing notes.",
        href: "https://vailnote.com/",
        tags: ["TypeScript", "Fresh", "Deno", "MongoDB"],
        image: "/pictures/vailnote.webp",
        imageCaption: "Live - vailnote.com",
    },
    {
        name: "WatchLock",
        description:
            "Lock your phone with your smartwatch. WearOS and Android, built for personal security.",
        href: "https://github.com/emilkrebs/WatchLock",
        tags: ["Kotlin", "Android", "WearOS"],
        image: "/pictures/watchlock.webp",
        imageCaption: "Live - github.com/emilkrebs/WatchLock",
    },
    {
        name: "BIPoC Climate Justice Conference",
        description:
            "The official site for the BIPoC Climate Justice Conference 2024 and 2025, localized and fully markdown-driven.",
        href: "https://bipoclimatejusticenetwork.org/",
        tags: ["Next.js", "TypeScript", "Localization"],
        image: "/pictures/bipoc.webp",
        imageCaption: "Live - bipoclimatejusticenetwork.org",
    },
    {
        name: "Langium Showcase",
        description:
            "DSL showcases built with Langium: state machines, arithmetic, MiniLogo, and domain models.",
        href: "https://langium.org/showcase/",
        tags: ["Langium", "TypeScript", "DSLs"],
        preview: "https://langium.org/showcase/minilogo/",
        previewCaption: "Live - langium.org/showcase/minilogo",
        placeholder: "/pictures/langium-placeholder.png",
        consent: true,
    },
    {
        name: "This site",
        description:
            "Static export. No server, no database. Typeset per the spec you are reading.",
        href: "/",
        tags: ["Next.js", "TypeScript", "Tailwind CSS"],
        image: "/pictures/this-site.webp",
        imageCaption: "Live - emilkrebs.dev",
    },
];

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

function Nav() {
    return (
        <nav aria-label="Primary" className="sticky top-0 z-50 bg-paper border-b border-hairline">
            <div className="mx-auto flex items-center justify-between max-w-[1120px] px-6 h-16">
                <a
                    href="#top"
                    className="font-semibold tracking-tight text-lg"
                >
                    emil<span className="text-signal">.</span>krebs
                </a>
                <div className="flex items-center gap-8">
                    {NAV.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="py-2 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft hover:text-ink transition-colors duration-150"
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
}

function Hero() {
    return (
        <section
            id="top"
            className="mx-auto max-w-[1120px] px-6 pt-16 md:pt-24 pb-16 md:pb-20"
        >
            <div className="flex flex-col-reverse md:flex-row md:items-start justify-between gap-12 md:gap-20">
                <div className="max-w-[640px]">
                    <h1 className="font-bold tracking-[-0.03em] leading-[0.95] text-[clamp(3rem,8vw,6.5rem)]">
                        Emil Krebs
                    </h1>
                    <p className="mt-8 text-lg md:text-xl leading-relaxed max-w-[46ch]">
                        Software engineer at TypeFox. Kiel, Germany.
                    </p>
                    <div className="mt-10 flex flex-wrap items-center gap-6">
                        <a
                            href={GITHUB_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 font-medium hover:text-signal transition-colors duration-150"
                        >
                            GitHub
                            <span className="text-signal" aria-hidden="true">→</span>
                        </a>
                        <a
                            href={LINKEDIN_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 font-medium hover:text-signal transition-colors duration-150"
                        >
                            LinkedIn
                            <span className="text-signal" aria-hidden="true">→</span>
                        </a>
                        <a
                            href={`mailto:${EMAIL_ADDRESS}`}
                            className="inline-flex items-center gap-2 font-medium hover:text-signal transition-colors duration-150"
                        >
                            Email
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
                            alt="Emil Krebs, Software engineer"
                            width={512}
                            height={512}
                            priority
                            className="absolute inset-0 size-full object-cover"
                        />
                      
                        <div className="absolute inset-0" aria-hidden="true" />
                        <div className="absolute left-1/2 top-[40%] h-32 w-24 -translate-x-1/2 -translate-y-1/2 border border-signal/70" aria-hidden="true">
                            <div className="duotone-tint absolute inset-0" />
                            <div className="duotone-lift absolute inset-0" />
                        </div>
                    </div>
                    <div
                        className="absolute -top-2.5 -right-2.5 z-20 bg-paper border border-signal/60 px-2.5 py-1.5"
                        role="status"
                    >
                        <p className="font-mono text-[10px] uppercase tracking-[0.08em] leading-tight">
                            <span className="block text-ink-soft">Cooking:</span>
                            <span className="block text-ink">Prami, Healthstack</span>
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

function Field() {
    return (
        <section
            id="field"
            className="mx-auto max-w-[1120px] px-6 py-16 md:py-24 border-t border-hairline"
        >
            <SectionHeading>Field</SectionHeading>
            <p className="text-xl md:text-2xl leading-relaxed max-w-[64ch]">
                I build the tools that read, understand, and transform code. At
                <i className="mx-1">TypeFox</i> that means custom domain-specific tools like IDEs. In my
                free time it means products: a spaced-repetition app, a lifestyle
                IDE powered by its own language & native AI, and a note tool built for
                privacy. I contribute to various open source projects.
            </p>
        </section>
    );
}

function WhatIDo() {
    return (
        <section className="mx-auto max-w-[1120px] px-6 py-16 md:py-24 border-t border-hairline">
            <SectionHeading>What I do</SectionHeading>
            <div className="flex flex-col gap-20 md:gap-24">
                {STRENGTHS.map((strength) => (
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

function Work() {
    const tags = ["TypeScript", "LSP", "Langium", "Theia", "Node.js"];
    return (
        <section
            id="work"
            className="mx-auto max-w-[1120px] px-6 py-16 md:py-24 border-t border-hairline"
        >
            <SectionHeading>Work</SectionHeading>
            <div className="bg-paper-deep border border-hairline p-8 md:p-12">
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
                    {/* TypeFox GmbH */}
                    <Image
                        src="https://www.typefox.io/assets/Logo_white_long.svg"
                        alt="TypeFox GmbH"
                        width={200}
                        height={50}
                        className="typefox-logo"
                    />
                </h3>
                <p className="mt-4 text-base md:text-lg leading-relaxed max-w-[60ch]">
                    Software Engineer: language servers,
                    the LSP, and the tooling that lets editors understand code.
                    This is the craft the rest of this page proves.
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

function ProjectCard({ project }: { project: Project }) {
    return (
        <article className="bg-paper-deep border border-hairline flex flex-col group hover:border-ink transition-colors duration-150">
            {project.preview && (
                <div className="relative">
                    <div className="relative aspect-[16/10] border-b border-hairline overflow-hidden bg-paper">
                        {project.consent ? (
                            <PreviewConsent
                                id={`consent-${project.name.toLowerCase().replace(/\s+/g, "-")}`}
                                src={project.preview}
                                title={`${project.name} preview`}
                                placeholder={project.placeholder}
                            />
                        ) : (
                            <iframe
                                src={project.preview}
                                title={`${project.name} preview`}
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
                    <div className="relative aspect-[16/10] border-b border-hairline overflow-hidden bg-paper">
                        {project.image ? (
                            <Image
                                src={project.image}
                                alt={`${project.name} screenshot`}
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
                            <ExternalNotice href={project.href} title={project.name} />
                        ) : (
                            <a
                                href={project.href}
                                target={project.href.startsWith("http") ? "_blank" : undefined}
                                rel={project.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                className="inline-flex items-center gap-2 font-medium group-hover:text-signal transition-colors duration-150"
                            >
                                Open
                                <span className="text-signal" aria-hidden="true">→</span>
                            </a>
                        )
                    ) : (
                        <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
                            Private
                        </span>
                    )}
                </div>
            </div>
        </article>
    );
}

function Projects() {
    return (
        <section
            id="projects"
            className="mx-auto max-w-[1120px] px-6 py-16 md:py-24 border-t border-hairline"
        >
            <SectionHeading>Projects</SectionHeading>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {FLAGSHIP_PROJECTS.map((project) => (
                    <ProjectCard key={project.name} project={project} />
                ))}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {PROJECTS.map((project, index) => (
                    <div
                        key={project.name}
                        className={
                            index % 3 === 0 || index === PROJECTS.length - 1
                                ? "md:col-span-2"
                                : ""
                        }
                    >
                        <ProjectCard project={project} />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default async function Page() {
    const personJsonLd = generatePersonJsonLd();
    const websiteJsonLd = generateWebsiteJsonLd();

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
            <Nav />
            <Hero />
            <Field />
            <WhatIDo />
            <Work />
            <Projects />
        </main>
    );
}
