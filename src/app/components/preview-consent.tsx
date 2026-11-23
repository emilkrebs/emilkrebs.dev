"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { PreviewConsentCopy } from "../lib/i18n";

interface PreviewConsentProps {
    id: string;
    src: string;
    title: string;
    /** A real screenshot of the previewed page, shown until the visitor loads the live version. */
    backdrop?: string;
    backdropAlt?: string;
    copy: PreviewConsentCopy;
    /** The backdrop's rendered width, for srcset selection. */
    sizes?: string;
}

/**
 * The consent gate for third-party live previews. Kept out of the server
 * page because the "Load preview" interaction replaces the gate with an
 * iframe: a script tag inside a server-rendered tree never runs, so the
 * click handler lives here as React state instead. The iframe is only
 * mounted after the click, so nothing is requested from the third party
 * before the visitor agrees.
 */
export function PreviewConsent({ id, src, title, backdrop, backdropAlt = "", copy, sizes = "100vw" }: PreviewConsentProps) {
    const [loaded, setLoaded] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const [gone, setGone] = useState(false);

    useEffect(() => {
        if (!loaded) return;
        const raf = requestAnimationFrame(() => requestAnimationFrame(() => setFadeIn(true)));
        return () => cancelAnimationFrame(raf);
    }, [loaded]);

    return (
        <div id={id} className="relative size-full">
            {loaded && (
                <iframe
                    src={src}
                    title={title}
                    referrerPolicy="no-referrer"
                    className={`size-full border-0 transition-opacity duration-700 ease-out ${fadeIn ? "opacity-100" : "opacity-0"}`}
                />
            )}
            {!gone && (
                <div
                    aria-hidden={loaded}
                    className={`absolute inset-0 flex items-center justify-center p-3 sm:p-4 transition-opacity duration-700 ease-out ${loaded ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                    onTransitionEnd={(e) => {
                        if (e.propertyName === "opacity") setGone(true);
                    }}
                >
                    {backdrop && (
                        // Blurred until loaded: it reads as a stand-in, not as the live page.
                        // The slight scale hides the blur's soft edge inside the plate's clip.
                        <Image
                            src={backdrop}
                            alt={backdropAlt}
                            fill
                            sizes={sizes}
                            className="absolute inset-0 object-cover object-top blur-sm scale-105"
                        />
                    )}
                    {/* A small solid panel, centered: the notice reads at full contrast over the blurred screenshot. */}
                    <div className="relative flex max-w-[17rem] flex-col items-center gap-3 bg-paper border border-hairline px-4 py-3 text-center">
                        <p className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft leading-relaxed">
                            {copy.notice}
                        </p>
                        <button
                            type="button"
                            onClick={() => setLoaded(true)}
                            className="bg-ink px-5 py-2.5 font-mono text-xs uppercase tracking-[0.08em] text-paper hover:bg-signal transition-colors duration-150"
                        >
                            {copy.load}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
