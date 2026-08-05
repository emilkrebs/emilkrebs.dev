"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface PreviewConsentProps {
    id: string;
    src: string;
    title: string;
    placeholder?: string;
}

/**
 * The consent gate for third-party live previews. Kept out of the server
 * page because the "Load preview" interaction replaces the gate with an
 * iframe: a script tag inside a server-rendered tree never runs, so the
 * click handler lives here as React state instead.
 */
export function PreviewConsent({ id, src, title, placeholder }: PreviewConsentProps) {
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
            <iframe
                src={src}
                title={title}
                loading="lazy"
                referrerPolicy="no-referrer"
                tabIndex={-1}
                aria-hidden={!loaded}
                className={`size-full border-0 transition-opacity duration-700 ease-out ${fadeIn ? "opacity-100" : "opacity-0"}`}
            />
            {!gone && (
                <div
                    aria-hidden={loaded}
                    className={`absolute inset-0 flex flex-col items-center justify-center gap-6 px-8 text-center transition-opacity duration-700 ease-out ${loaded ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                    onTransitionEnd={(e) => {
                        if (e.propertyName === "opacity") setGone(true);
                    }}
                >
                    {placeholder && (
                        <Image
                            src={placeholder}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            aria-hidden="true"
                            className="absolute inset-0 object-cover object-top blur-md scale-105"
                        />
                    )}
                    <div className="relative flex flex-col items-center justify-center gap-6">
                        <p className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft leading-loose">
                            The preview loads a third-party site with its own scripts.
                        </p>
                        <button
                            type="button"
                            onClick={() => setLoaded(true)}
                            className="bg-ink px-6 py-3 font-mono text-xs uppercase tracking-[0.08em] text-paper hover:bg-signal transition-colors duration-150"
                        >
                            Load preview
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
