"use client";

import Image from "next/image";
import { useState } from "react";
import type { Locale } from "../lib/i18n";
import { FULL_WIDTH_SIZES } from "../lib/image-sizes";

/**
 * The project demo, click-gated: a GIF is motion, and the site's motion rule
 * says nothing animates by itself (DESIGN.md > Motion). The poster frame (the
 * results list at ~8 s) ships with the page; the GIF is requested from this
 * site only on an explicit press, and Stop unmounts it again. The paths live
 * in this client module on purpose: passing them as props would serialize
 * them into the initial HTML, and the gated demo must not be in the initial
 * payload.
 */
const GIF: Record<Locale, string> = {
    en: "/pictures/projects/med-research-mcp/med-research-mcp-demo.gif",
    zh: "/pictures/projects/med-research-mcp/med-research-mcp-demo-zh.gif",
};
const POSTER: Record<Locale, string> = {
    en: "/pictures/projects/med-research-mcp/poster-en.png",
    zh: "/pictures/projects/med-research-mcp/poster-zh.png",
};

interface ProjectDemoProps {
    locale: Locale;
    alt: string;
    /** Includes the GIF's weight, measured at build time. */
    playLabel: string;
    stopLabel: string;
    note: string;
    noscript: string;
}

export function ProjectDemo({ locale, alt, playLabel, stopLabel, note, noscript }: ProjectDemoProps) {
    const [playing, setPlaying] = useState(false);
    return (
        <figure>
            <div className="relative aspect-video border border-hairline overflow-hidden bg-paper">
                {playing ? (
                    // A GIF cannot go through next/image: the custom loader
                    // only serves raster variants, and the optimizer never
                    // renders GIFs. A plain img keeps it out of the initial
                    // payload entirely.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={GIF[locale]}
                        alt={alt}
                        width={1280}
                        height={720}
                        className="absolute inset-0 size-full object-cover"
                    />
                ) : (
                    <Image
                        src={POSTER[locale]}
                        alt={alt}
                        fill
                        sizes={FULL_WIDTH_SIZES}
                        className="object-cover object-center"
                    />
                )}
            </div>
            <figcaption className="pt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink/75 max-w-[62ch]">
                    {note}
                </span>
                <button
                    type="button"
                    onClick={() => setPlaying((current) => !current)}
                    className="shrink-0 bg-ink text-paper px-5 py-3 font-mono text-xs uppercase tracking-[0.08em] hover:bg-signal transition-colors duration-150"
                >
                    {playing ? stopLabel : playLabel}
                </button>
            </figcaption>
            <noscript>
                <p className="pt-2 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">{noscript}</p>
            </noscript>
        </figure>
    );
}
