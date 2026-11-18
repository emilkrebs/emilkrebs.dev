import Image from "next/image";
import type { Metadata } from "next";
import { existsSync } from "fs";
import { join } from "path";
import content from "../../content/healthstack.json";
import { PlaceholderPlate } from "../../components/placeholder-plate";
import { PageSection, Plate, ProjectHero, ProjectShell } from "../../components/project-layout";
import { Tag } from "../../components/tag";
import { FULL_WIDTH_SIZES } from "../../lib/image-sizes";
import { pageMetadata } from "../../lib/metadata";

interface FeatureSection {
    heading: string;
    /** `*accent*` renders in the serif italic. */
    title: string;
    proof: string;
    stats: { value: string; label: string }[];
    /** Screenshot path; until one exists, `placeholder` labels the pending plate. */
    image?: string;
    /** What the screenshot shows; required once `image` is set. */
    imageAlt?: string;
    placeholder: string;
    caption: string;
}

interface HealthstackContent {
    meta: { title: string; description: string };
    hero: {
        title: string;
        status: string;
        lead: string;
        tags: string[];
        image: string;
        imageAlt: string;
        caption: string;
    };
    sections: FeatureSection[];
    dsl: {
        /** `` `code` `` renders as inline code. */
        body: string;
        heading: string;
        label: string;
        openFullScreen: string;
        iframeTitle: string;
        fallbackLabel: string;
        fallbackBody: string;
    };
    status: { heading: string; title: string; body: string; tags: string[] };
}

const page: HealthstackContent = content;

// JPEG copy of the dashboard screenshot: link unfurlers do not reliably render WebP.
const OG_IMAGE = {
    url: "/og/healthstack.jpg",
    width: 1280,
    height: 800,
    alt: page.hero.imageAlt,
};

export const metadata: Metadata = pageMetadata({
    route: "healthstack",
    title: page.meta.title,
    description: page.meta.description,
    image: OG_IMAGE,
});

const PLAYGROUND_URL = process.env.NEXT_PUBLIC_PLAYGROUND_URL ?? "";

/**
 * In development the playground runs from the Vite dev server (hot reload)
 * and is assumed to be up. In a static build the bundled playground exists
 * only if the build chain produced public/playground/index.html; when it is
 * missing, the section renders an honest fallback instead of a dead iframe.
 */
function playgroundIsBuilt(): boolean {
    if (PLAYGROUND_URL) return true;
    return existsSync(join(process.cwd(), "public", "playground", "index.html"));
}

/** Plain text with `*accent*` in the serif italic and `` `code` `` as inline code. */
function InlineText({ text }: { text: string }) {
    return text.split(/(\*[^*]+\*|`[^`]+`)/).map((part, i) => {
        if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) {
            return <em key={i} className="font-serif italic font-normal">{part.slice(1, -1)}</em>;
        }
        if (part.length > 2 && part.startsWith("`") && part.endsWith("`")) {
            return <code key={i} className="font-mono text-sm">{part.slice(1, -1)}</code>;
        }
        return part;
    });
}

function SectionHeading({ children }: { children: string }) {
    return (
        <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft mb-10">
            {children}
        </h2>
    );
}

interface ShotProps {
    src?: string;
    alt: string;
    caption: string;
    placeholder?: string;
}

function Shot({ src, alt, caption, placeholder }: ShotProps) {
    return (
        <Plate caption={caption} className="aspect-16/10 bg-paper">
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes={FULL_WIDTH_SIZES}
                    className="object-cover object-center"
                />
            ) : (
                <PlaceholderPlate label={placeholder ?? ""} />
            )}
        </Plate>
    );
}

function StatTable({ stats }: { stats: { value: string; label: string }[] }) {
    const fill = (6 - (stats.length % 6)) % 6;
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-hairline border border-hairline">
            {stats.map((stat) => (
                <div key={stat.label} className="min-w-0 bg-paper-deep p-4 [overflow-wrap:anywhere]">
                    <div className="font-mono text-sm md:text-base text-ink leading-snug">
                        {stat.value}
                    </div>
                    <div className="mt-1 font-mono text-xs uppercase tracking-[0.08em] text-ink/75">
                        {stat.label}
                    </div>
                </div>
            ))}
            {Array.from({ length: fill }).map((_, i) => (
                <div
                    key={`fill-${i}`}
                    aria-hidden="true"
                    className="bg-paper-deep p-4"
                />
            ))}
        </div>
    );
}

function FeatureSection({ section }: { section: FeatureSection }) {
    return (
        <PageSection className="py-16 md:py-20">
            <SectionHeading>{section.heading}</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                <div className="md:col-span-5 flex flex-col">
                    <h3 className="text-2xl md:text-3xl font-semibold tracking-tight leading-snug">
                        <InlineText text={section.title} />
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-ink/85">
                        {section.proof}
                    </p>
                </div>
                <div className="md:col-span-7">
                    <StatTable stats={section.stats} />
                </div>
            </div>
            <div className="mt-8">
                <Shot
                    src={section.image}
                    alt={section.imageAlt ?? `${section.heading} in the Healthstack dev build`}
                    caption={section.caption}
                    placeholder={section.placeholder}
                />
            </div>
        </PageSection>
    );
}

export default function HealthstackPage() {
    const { hero, dsl, status } = page;
    const playgroundBuilt = playgroundIsBuilt();
    return (
        <ProjectShell
            route="healthstack"
            name={page.meta.title}
            description={page.meta.description}
            image={hero.image}
            analytics
        >
            <ProjectHero title={hero.title} status={hero.status} lead={hero.lead}>
                <div className="mt-8 flex flex-wrap gap-2">
                    {hero.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                    ))}
                </div>
                <div className="mt-10 md:mt-14">
                    <Shot src={hero.image} alt={hero.imageAlt} caption={hero.caption} />
                </div>
            </ProjectHero>

            <PageSection id="dsl" className="py-16 md:py-20 scroll-mt-16">
                <SectionHeading>{dsl.heading}</SectionHeading>
                <p className="text-base md:text-lg leading-relaxed max-w-[62ch] mb-10">
                    <InlineText text={dsl.body} />
                </p>
                <div className="bg-paper-deep border border-hairline p-8 md:p-10">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-6">
                        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-ink/75">
                            <span
                                className="bg-signal w-1.5 h-1.5 shrink-0"
                                aria-hidden="true"
                            />
                            {dsl.label}
                        </div>
                        {playgroundBuilt && (
                            // A separate Vite app, not a Next.js route: a plain anchor, no client routing.
                            <a
                                href={`${PLAYGROUND_URL}/playground/`}
                                className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft hover:text-ink transition-colors duration-150"
                            >
                                {dsl.openFullScreen}
                            </a>
                        )}
                    </div>
                    {playgroundBuilt ? (
                        <iframe
                            src={`${PLAYGROUND_URL}/playground/?sample=type-system`}
                            title={dsl.iframeTitle}
                            loading="lazy"
                            className="block w-full h-120 md:h-160 border border-hairline bg-paper"
                        />
                    ) : (
                        <div className="flex h-120 md:h-160 flex-col items-center justify-center gap-4 border border-hairline bg-paper px-6 text-center">
                            <p className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
                                {dsl.fallbackLabel}
                            </p>
                            <p className="max-w-[52ch] text-sm leading-relaxed text-ink/85">
                                {dsl.fallbackBody}
                            </p>
                        </div>
                    )}
                </div>
            </PageSection>

            {page.sections.map((section) => (
                <FeatureSection key={section.heading} section={section} />
            ))}

            <PageSection className="py-16 md:py-24">
                <SectionHeading>{status.heading}</SectionHeading>
                <div className="bg-paper-deep border border-hairline p-8 md:p-10">
                    <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
                        {status.title}
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-ink/85 max-w-[62ch]">
                        {status.body}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                        {status.tags.map((tag) => (
                            <Tag key={tag}>{tag}</Tag>
                        ))}
                    </div>
                </div>
            </PageSection>
        </ProjectShell>
    );
}
