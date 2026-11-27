import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { existsSync } from "fs";
import { join } from "path";
import content from "../../content/healthstack.json";
import { PlaceholderPlate } from "../../components/placeholder-plate";
import {
    HeadLink,
    HeadMeta,
    JumpRow,
    PageSection,
    Plate,
    PROSE_MEASURE,
    ProjectHero,
    ProjectShell,
} from "../../components/project-layout";
import { LINK_CLASS } from "../../components/readme";
import { PLAYGROUND_PATH } from "../../lib/constants";
import { copy } from "../../lib/i18n";
import { FULL_WIDTH_SIZES } from "../../lib/image-sizes";
import { pageMetadata } from "../../lib/metadata";
import { ROUTES, routePath, type RouteKey } from "../../lib/routes";

/**
 * The Healthstack page, set in the same record grammar as /med-research-mcp
 * (DESIGN.md > Pages): a head with the mark beside the name, the lead shared
 * with the landing card, one block-link, the jump row and the metadata line
 * with its exit; then one document, its h2s opening hairline-ruled sections.
 * Headings, rules, spec tables, cards and the evidence (the live playground
 * and the dev-build screenshots) all run the section's full measure, aligned
 * with each other; only running prose stops at the prose measure. The agents
 * close the document as a card group, as the skills close the record page.
 */

interface Spec {
    label: string;
    value: string;
}

interface CapabilitySection {
    /** Heading slug: the jump row's target. */
    id: string;
    heading: string;
    /** The jump row's label. */
    short: string;
    /** `*accent*` renders in the serif italic, `` `code` `` as inline code. */
    body: string;
    specs: Spec[];
    /** Screenshot path; until one exists, `placeholder` labels the pending plate. */
    image?: string;
    /** What the screenshot shows; required once `image` is set. */
    imageAlt?: string;
    placeholder: string;
    caption: string;
}

interface Agent {
    name: string;
    role: string;
    /** Also takes `[label](route:<RouteKey>)` links. */
    description: string;
}

interface HealthstackContent {
    meta: { title: string; description: string; imageAlt: string };
    head: {
        status: string;
        tryLanguage: string;
        contentsAria: string;
        stack: string[];
        playgroundExit: string;
    };
    intro: string;
    preview: { label: string; body: string };
    language: {
        id: string;
        heading: string;
        short: string;
        body: string;
        caption: string;
        openFullScreen: string;
        iframeTitle: string;
        fallbackLabel: string;
        fallbackBody: string;
    };
    sections: CapabilitySection[];
    agents: {
        id: string;
        heading: string;
        short: string;
        body: string;
        list: Agent[];
        image: string;
        imageAlt: string;
        caption: string;
    };
}

const page: HealthstackContent = content;

/** The one-sentence lead, shared with the landing card so they cannot drift. */
function healthstackLead(): string {
    const flagship = copy.en.flagships.find((candidate) => candidate.id === "healthstack");
    if (!flagship) throw new Error("Missing landing copy for flagship \"healthstack\"");
    return flagship.description;
}

// JPEG copy of the landing plate: link unfurlers do not reliably render WebP.
const OG_IMAGE = {
    url: "/og/healthstack.jpg",
    width: 1280,
    height: 800,
    alt: page.meta.imageAlt,
};

export const metadata: Metadata = pageMetadata({
    route: "healthstack",
    title: page.meta.title,
    description: page.meta.description,
    image: OG_IMAGE,
});

/**
 * In development the playground runs from the Vite dev server (hot reload)
 * and is assumed to be up. In a static build the bundled playground exists
 * only if the build chain produced public/playground/index.html; when it is
 * missing, the section renders an honest fallback instead of a dead iframe.
 */
function playgroundIsBuilt(): boolean {
    if (process.env.NEXT_PUBLIC_PLAYGROUND_URL) return true;
    return existsSync(join(process.cwd(), "public", "playground", "index.html"));
}

function isRouteKey(key: string): key is RouteKey {
    return key in ROUTES;
}

/**
 * Authored copy in the README's inline grammar: `*accent*` in the serif
 * italic, `` `code` `` as the code chip, `[label](route:<key>)` as a link to
 * a page of this site, resolved through the route table.
 */
function InlineText({ text }: { text: string }) {
    return text.split(/(\*[^*]+\*|`[^`]+`|\[[^\]]+\]\(route:[a-z_]+\))/).map((part, i) => {
        if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) {
            return <em key={i} className="font-serif italic">{part.slice(1, -1)}</em>;
        }
        if (part.length > 2 && part.startsWith("`") && part.endsWith("`")) {
            return (
                <code key={i} className="bg-paper-deep font-mono text-[0.85em] px-1.5 py-0.5">
                    {part.slice(1, -1)}
                </code>
            );
        }
        const link = /^\[([^\]]+)\]\(route:([a-z_]+)\)$/.exec(part);
        if (link) {
            const [, label, route] = link;
            if (!isRouteKey(route)) throw new Error(`Unknown route "${route}" in Healthstack copy`);
            return (
                <Link key={i} href={routePath(route)} className={LINK_CLASS}>
                    {label}
                </Link>
            );
        }
        return part;
    });
}

/** An h2 set like the README's on /med-research-mcp: it opens a hairline-ruled section. */
function DocHeading({ id, children }: { id: string; children: string }) {
    return (
        <h2
            id={id}
            className="mt-12 mb-4 scroll-mt-18 border-t border-hairline pt-6 text-2xl font-semibold leading-snug tracking-tight md:mt-16 md:text-3xl"
        >
            {children}
        </h2>
    );
}

/**
 * A capability's facts in the README table's grammar: mono labels as in its
 * head row, body-set values as in its cells, hairline rules, paper ground.
 */
function SpecTable({ specs }: { specs: Spec[] }) {
    const fill = (6 - (specs.length % 6)) % 6;
    return (
        <dl className="mt-6 grid grid-cols-2 gap-px border border-hairline bg-hairline md:grid-cols-3">
            {specs.map((spec) => (
                <div key={spec.label} className="min-w-0 bg-paper px-4 py-3">
                    <dt className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
                        {spec.label}
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed [overflow-wrap:anywhere]">
                        {spec.value}
                    </dd>
                </div>
            ))}
            {Array.from({ length: fill }).map((_, i) => (
                <div key={`fill-${i}`} aria-hidden="true" className="bg-paper" />
            ))}
        </dl>
    );
}

interface ShotProps {
    src?: string;
    alt: string;
    caption: string;
    placeholder?: string;
}

/** A body paragraph: full-measure left edge, stopped at the prose measure. */
function Prose({ text, className = "" }: { text: string; className?: string }) {
    return (
        <p className={className ? `leading-relaxed ${PROSE_MEASURE} ${className}` : `leading-relaxed ${PROSE_MEASURE}`}>
            <InlineText text={text} />
        </p>
    );
}

/** A dev-build screenshot on the full measure, so the UI keeps a legible size. */
function Shot({ src, alt, caption, placeholder }: ShotProps) {
    return (
        <div className="mt-10">
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
        </div>
    );
}

function Capability({ section }: { section: CapabilitySection }) {
    return (
        <>
            <DocHeading id={section.id}>{section.heading}</DocHeading>
            <Prose text={section.body} />
            <SpecTable specs={section.specs} />
            <Shot
                src={section.image}
                alt={section.imageAlt ?? `${section.heading} in the Healthstack dev build`}
                caption={section.caption}
                placeholder={section.placeholder}
            />
        </>
    );
}

/** The live editor: same-origin, lazy, no consent gate (DESIGN.md > Pages > /playground). */
function Playground({ built }: { built: boolean }) {
    const { language } = page;
    return (
        <div className="mt-10">
            <Plate
                caption={language.caption}
                captionAbove
                action={
                    built && (
                        // A separate Vite app, not a Next.js route: a plain anchor, no client routing.
                        <a href={PLAYGROUND_PATH} className="hover:text-signal transition-colors duration-150">
                            {language.openFullScreen} <span className="text-signal" aria-hidden="true">→</span>
                        </a>
                    )
                }
                className="h-120 bg-paper md:h-168"
            >
                {built ? (
                    <iframe
                        src={`${PLAYGROUND_PATH}?sample=type-system`}
                        title={language.iframeTitle}
                        loading="lazy"
                        className="absolute inset-0 block size-full"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
                        <p className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
                            {language.fallbackLabel}
                        </p>
                        <p className="max-w-[52ch] text-sm leading-relaxed text-ink/85">
                            {language.fallbackBody}
                        </p>
                    </div>
                )}
            </Plate>
        </div>
    );
}

/** A hairline card on paper, the anatomy of the skill cards on /med-research-mcp. */
function AgentCard({ agent }: { agent: Agent }) {
    return (
        <article className="flex h-full flex-col border border-hairline">
            <div className="flex-1 p-5">
                <h3 className="text-base font-semibold [overflow-wrap:anywhere]">{agent.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/85">
                    <InlineText text={agent.description} />
                </p>
            </div>
            <div className="border-t border-hairline px-5 py-3 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
                {agent.role}
            </div>
        </article>
    );
}

export default function HealthstackPage() {
    const { head, preview, language, sections, agents } = page;
    const lead = healthstackLead();
    const playgroundBuilt = playgroundIsBuilt();
    const contents = [language, ...sections, agents].map((section) => ({
        href: `#${section.id}`,
        label: section.short,
    }));
    return (
        <ProjectShell
            route="healthstack"
            name={page.meta.title}
            description={lead}
            image="/pictures/healthstack-dashboard.webp"
            analytics
        >
            <ProjectHero title={page.meta.title} mark="/pictures/healthstack.svg" status={head.status} lead={lead}>
                <HeadLink href={`#${language.id}`}>{head.tryLanguage}</HeadLink>
                <JumpRow label={head.contentsAria} items={contents} />
                <HeadMeta
                    meta={head.stack.join(" · ")}
                    exits={playgroundBuilt ? [{ label: head.playgroundExit, href: PLAYGROUND_PATH }] : []}
                />
            </ProjectHero>

            <PageSection className="pt-12 pb-16 md:pt-16 md:pb-24">
                <Prose text={page.intro} className="mb-6" />
                {/* Set like the README's [!IMPORTANT] alert on /med-research-mcp. */}
                <aside className="border border-hairline bg-paper-deep p-4 md:p-5">
                    <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-ink">
                        <span className="size-1.5 bg-signal" aria-hidden="true" />
                        {preview.label}
                    </p>
                    <Prose text={preview.body} />
                </aside>

                <DocHeading id={language.id}>{language.heading}</DocHeading>
                <Prose text={language.body} />
                <Playground built={playgroundBuilt} />

                {sections.map((section) => (
                    <Capability key={section.id} section={section} />
                ))}

                <DocHeading id={agents.id}>{agents.heading}</DocHeading>
                <Prose text={agents.body} />
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {agents.list.map((agent) => (
                        <AgentCard key={agent.name} agent={agent} />
                    ))}
                </div>
                <Shot src={agents.image} alt={agents.imageAlt} caption={agents.caption} />
            </PageSection>
        </ProjectShell>
    );
}
