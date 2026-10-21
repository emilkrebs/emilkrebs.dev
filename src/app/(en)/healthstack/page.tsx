import type { Metadata } from "next";
import { existsSync } from "fs";
import { join } from "path";
import content from "../../content/healthstack.json";
import BackHeader from "../../components/back-header";
import { JsonLd } from "../../components/json-ld";
import {
    FeatureSection,
    InlineText,
    SectionHeading,
    Shot,
    StatusSection,
    type Stat,
} from "../../components/project-page";
import { StatusLabel, Tag } from "../../components/tag";
import { pageMetadata } from "../../lib/metadata";
import { projectPageSchema } from "../../lib/structured-data";

interface FeatureContent {
    heading: string;
    /** `*accent*` renders in the serif italic. */
    title: string;
    proof: string;
    stats: Stat[];
    /** Screenshot path; until one exists, `placeholder` labels the pending plate. */
    image?: string;
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
    sections: FeatureContent[];
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

export default function HealthstackPage() {
    const { hero, dsl, status } = page;
    const playgroundBuilt = playgroundIsBuilt();
    return (
        <main id="main" className="flex-1">
            <JsonLd
                data={projectPageSchema({
                    route: "healthstack",
                    locale: "en",
                    name: page.meta.title,
                    description: page.meta.description,
                    image: hero.image,
                })}
            />
            <BackHeader route="healthstack" />

            <section className="mx-auto max-w-280 px-6 pt-10 md:pt-16 pb-16 md:pb-20">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <h1 className="font-bold tracking-[-0.03em] leading-[0.95] text-[clamp(2rem,4.5vw,3.25rem)] max-w-[16ch]">
                        {hero.title}
                    </h1>
                    <StatusLabel>{hero.status}</StatusLabel>
                </div>
                <p className="mt-6 max-w-[62ch] text-base md:text-lg leading-relaxed">
                    {hero.lead}
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                    {hero.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                    ))}
                </div>
                <div className="mt-10 md:mt-14">
                    <Shot src={hero.image} alt={hero.imageAlt} caption={hero.caption} />
                </div>
            </section>

            {page.sections.map((section) => (
                <FeatureSection
                    key={section.heading}
                    heading={section.heading}
                    title={section.title}
                    proof={section.proof}
                    stats={section.stats}
                >
                    <Shot
                        src={section.image}
                        alt={`${section.heading} in the Healthstack dev build`}
                        caption={section.caption}
                        placeholder={section.placeholder}
                    />
                </FeatureSection>
            ))}

            <section id="dsl" className="mx-auto max-w-280 px-6 py-16 md:py-20 border-t border-hairline scroll-mt-16">
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
            </section>

            <StatusSection
                heading={status.heading}
                title={status.title}
                body={status.body}
                tags={status.tags}
            />
        </main>
    );
}
