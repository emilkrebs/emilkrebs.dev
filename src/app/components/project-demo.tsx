import { Plate } from "./project-layout";
import type { Locale } from "../lib/i18n";

/**
 * The project demo, autoplaying. A recording of the tool working is content,
 * not decoration: it is the page's main evidence, and gating it behind a click
 * made the strongest asset on the page behave like a leaked video. DESIGN.md
 * > Motion carries this as a scoped exception for record pages.
 *
 * Ships as animated WebP (scripts/sync-project.mjs re-encodes the upstream GIF
 * at 1120px, about a third of the bytes). It lives under public/media rather
 * than public/pictures on purpose: the responsive-image pipeline scans
 * pictures/ and would render four unused variants of an animation. A plain img
 * keeps it out of that pipeline and out of next/image.
 */
const DEMO: Record<Locale, string> = {
    en: "/media/med-research-mcp/med-research-mcp-demo.webp",
    zh: "/media/med-research-mcp/med-research-mcp-demo-zh.webp",
};

interface ProjectDemoProps {
    locale: Locale;
    alt: string;
    /** One line above the plate: what the ten seconds show. */
    note: string;
}

export function ProjectDemo({ locale, alt, note }: ProjectDemoProps) {
    return (
        // The label sits above the plate: the recording opens on an empty chat
        // window, so without a line there the first second reads as a broken
        // embed rather than a demo.
        <Plate caption={note} captionAbove className="aspect-video bg-paper-deep">
            {/* eslint-disable-next-line @next/next/no-img-element -- animated WebP: an animation is not an image the responsive pipeline can serve */}
            <img
                src={DEMO[locale]}
                alt={alt}
                width={1120}
                height={630}
                decoding="async"
                className="absolute inset-0 size-full object-cover"
            />
        </Plate>
    );
}