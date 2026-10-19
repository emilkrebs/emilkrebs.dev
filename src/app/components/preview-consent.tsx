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
                    className={`absolute inset-0 flex flex-col items-center justify-center gap-6 px-8 text-center transition-opacity duration-700 ease-out ${loaded ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                    onTransitionEnd={(e) => {
                        if (e.propertyName === "opacity") setGone(true);
                    }}
                >
                    {backdrop && (
                        <Image
                            src={backdrop}
                            alt={backdropAlt}
                            fill
                            sizes={sizes}
                            className="absolute inset-0 object-cover object-top"
                        />
                    )}
                    {/* A solid panel, so the notice reads at full contrast over any screenshot. */}
                    <div className="relative flex max-w-sm flex-col items-center justify-center gap-4 bg-paper border border-hairline px-6 py-5">
                        <p className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft leading-loose">
                            {copy.notice}
                        </p>
                        <button
                            type="button"
                            onClick={() => setLoaded(true)}
                            className="bg-ink px-6 py-3 font-mono text-xs uppercase tracking-[0.08em] text-paper hover:bg-signal transition-colors duration-150"
                        >
                            {copy.load}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
