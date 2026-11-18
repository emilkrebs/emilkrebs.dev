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
 * shell, the head, the hairline section and the captioned plate. What is a
 * page's own (the playground and stat tables on /healthstack, the README and
 * skill cards on /med-research-mcp) stays in that page.
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
    /** The frame's aspect ratio and surface, e.g. "aspect-16/10 bg-paper". */
    className: string;
    /** The media, positioned absolutely or filling the frame. */
    children: ReactNode;
}

/** A hairline plate with a mono caption: screenshots, recordings, placeholders. */
export function Plate({ caption, captionAbove = false, className, children }: PlateProps) {
    const figcaption = (
        <figcaption
            className={`font-mono text-xs uppercase tracking-[0.08em] text-ink/75 ${captionAbove ? "pb-3" : "pt-3"}`}
        >
            {caption}
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
