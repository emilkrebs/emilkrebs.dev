"use client";

import { useState } from "react";

interface PreviewConsentProps {
    id: string;
    src: string;
    title: string;
}

/**
 * The consent gate for third-party live previews. Kept out of the server
 * page because the "Load preview" interaction replaces the gate with an
 * iframe: a script tag inside a server-rendered tree never runs, so the
 * click handler lives here as React state instead.
 */
export function PreviewConsent({ id, src, title }: PreviewConsentProps) {
    const [loaded, setLoaded] = useState(false);

    if (loaded) {
        return (
            <iframe
                src={src}
                title={title}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="size-full border-0"
                tabIndex={-1}
            />
        );
    }

    return (
        <div
            id={id}
            className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-8 text-center"
        >
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
    );
}
