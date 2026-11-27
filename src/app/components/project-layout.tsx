import type { ReactNode } from "react";
import { Analytics } from "./analytics";
import BackHeader from "./back-header";
import { JsonLd } from "./json-ld";
import { StatusLabel } from "./tag";
import type { Locale } from "../lib/i18n";
import type { RouteKey } from "../lib/routes";
import { projectPageSchema } from "../lib/structured-data";

/**
 * The parts /healthstack and /med-research-mcp set the same way: the page
 * shell, the head and its rows (block-link, jump row, metadata line with the
 * exits), the hairline section, the document column and the captioned plate.
 * What is a page's own (the playground, spec tables and agent cards on
 * /healthstack, the README and skill cards on /med-research-mcp) stays in
 * that page.
 */

interface ProjectShellProps {
    route: RouteKey;
    locale?: Locale;
    /** Name, description and primary image for the page's JSON-LD node. */
    name: string;
    description: string;
    image: string;
    /**
     * Whether the page loads the site analytics script. Explicit on purpose:
     * /med-research-mcp must render with the network restricted to
     * emilkrebs.dev, so it opts out.
     */
    analytics: boolean;
    children: ReactNode;
}

export function ProjectShell({ route, locale = "en", name, description, image, analytics, children }: ProjectShellProps) {
    return (
        <main id="main" className="flex-1">
            {analytics && <Analytics />}
            <JsonLd data={projectPageSchema({ route, locale, name, description, image })} />
            <BackHeader route={route} locale={locale} />
            {children}
        </main>
    );
}

interface ProjectHeroProps {
    title: string;
    /** The project's own mark beside the title: an SVG that keeps its own colours. */
    mark?: string;
    /** A real project state, set at the far end of the title row. */
    status?: string;
    lead: string;
    /** Page-specific rows under the lead. */
    children?: ReactNode;
}

export function ProjectHero({ title, mark, status, lead, children }: ProjectHeroProps) {
    return (
        <section className="mx-auto max-w-280 px-6 pt-10 pb-10 md:pt-14 md:pb-12">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    {mark && (
                        // eslint-disable-next-line @next/next/no-img-element -- brand mark: an SVG that must keep its own colours
                        <img src={mark} alt="" aria-hidden="true" width={48} height={48} className="size-12 shrink-0" />
                    )}
                    <h1 className="max-w-[16ch] text-[clamp(1.75rem,2.6vw,2.25rem)] font-bold leading-[1.05] tracking-[-0.03em]">
                        {title}
                    </h1>
                </div>
                {status && <StatusLabel>{status}</StatusLabel>}
            </div>
            <p className="mt-5 max-w-[62ch] text-base leading-relaxed md:text-lg">{lead}</p>
            {children}
        </section>
    );
}

/** The head's one block-link: the whole paper-deep block is the link into the page's main section. */
export function HeadLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <a
            href={href}
            className="mt-8 flex items-center justify-between gap-x-6 border border-hairline bg-paper-deep px-4 py-3.5 transition-colors duration-150 hover:border-ink md:px-5"
        >
            <span className="text-base font-medium">{children}</span>
            <span className="text-signal" aria-hidden="true">→</span>
        </a>
    );
}

interface JumpRowProps {
    /** Accessible name of the row, e.g. "On this page". */
    label: string;
    items: { href: string; label: string }[];
}

/** The head's mono jump row into the page's own sections. */
export function JumpRow({ label, items }: JumpRowProps) {
    return (
        <nav
            aria-label={label}
            className="mt-6 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs uppercase tracking-[0.08em] text-ink/75"
        >
            {items.map((item) => (
                <a
                    key={item.href}
                    href={item.href}
                    className="py-1 hover:text-signal transition-colors duration-150"
                >
                    {item.label}
                </a>
            ))}
        </nav>
    );
}

export interface HeadExit {
    label: string;
    href: string;
    /** Opens in a new tab: another site, not this one. */
    external?: boolean;
}

/** The head's quiet closing row: one mono metadata line beside the arrow exits. */
export function HeadMeta({ meta, exits }: { meta: string; exits: HeadExit[] }) {
    return (
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <span className="font-mono text-xs tracking-[0.08em] text-ink-soft">{meta}</span>
            {exits.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-6 md:ml-auto">
                    {exits.map((exit) => (
                        <a
                            key={exit.label}
                            href={exit.href}
                            target={exit.external ? "_blank" : undefined}
                            rel={exit.external ? "noopener noreferrer" : undefined}
                            className="inline-flex items-center gap-2 py-2 font-medium hover:text-signal transition-colors duration-150"
                        >
                            {exit.label}
                            <span className="text-signal" aria-hidden="true">→</span>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}

/** The document column: prose and cards sit here, wide figures break out to the section's full measure. */
export function DocColumn({ className = "", children }: { className?: string; children: ReactNode }) {
    return <div className={className ? `mx-auto max-w-4xl ${className}` : "mx-auto max-w-4xl"}>{children}</div>;
}

interface PageSectionProps {
    id?: string;
    /** The page's own vertical rhythm (padding), plus anything like scroll-mt. */
    className?: string;
    children: ReactNode;
}

/** A section on the 1120px measure, opened by a hairline. */
export function PageSection({ id, className = "", children }: PageSectionProps) {
    return (
        <section id={id} className={`mx-auto max-w-280 border-t border-hairline px-6 ${className}`}>
            {children}
        </section>
    );
}

interface PlateProps {
    caption: string;
    /** Sets the caption above the plate instead of under it. */
    captionAbove?: boolean;
    /** A link set at the far end of the caption row. */
    action?: ReactNode;
    /** The frame's aspect ratio and surface, e.g. "aspect-16/10 bg-paper". */
    className: string;
    /** The media, positioned absolutely or filling the frame. */
    children: ReactNode;
}

/** A hairline plate with a mono caption: screenshots, recordings, live embeds, placeholders. */
export function Plate({ caption, captionAbove = false, action, className, children }: PlateProps) {
    const figcaption = (
        <figcaption
            className={`font-mono text-xs uppercase tracking-[0.08em] text-ink/75 ${captionAbove ? "pb-3" : "pt-3"}${action ? " flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1" : ""}`}
        >
            {action ? <span>{caption}</span> : caption}
            {action}
        </figcaption>
    );
    return (
        <figure>
            {captionAbove && figcaption}
            <div className={`relative overflow-hidden border border-hairline ${className}`}>{children}</div>
            {!captionAbove && figcaption}
        </figure>
    );
}
