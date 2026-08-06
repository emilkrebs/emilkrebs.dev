"use client";

import { useEffect, useRef, useState } from "react";

interface ExternalNoticeProps {
    href: string;
    title: string;
}

/**
 * The consent gate for external products that are still in testing.
 * Renders the same link a plain anchor would, but intercepts the click
 * and asks for acknowledgement before redirecting.
 */
export function ExternalNotice({ href, title }: ExternalNoticeProps) {
    const [open, setOpen] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);
    const returnFocusRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return;

        const previouslyFocused = document.activeElement as HTMLElement | null;
        dialogRef.current?.focus();

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };

        document.addEventListener("keydown", onKeyDown);
        document.documentElement.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.documentElement.style.overflow = "";
            previouslyFocused?.focus();
        };
    }, [open]);

    return (
        <>
            <button
                type="button"
                ref={returnFocusRef}
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 font-medium group-hover:text-signal transition-colors duration-150"
            >
                Open
                <span className="text-signal" aria-hidden="true">→</span>
            </button>

            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-6"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="external-notice-title"
                >
                    <button
                        type="button"
                        aria-label="Close notice"
                        onClick={() => setOpen(false)}
                        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
                    />
                    <div
                        ref={dialogRef}
                        tabIndex={-1}
                        className="relative w-full max-w-lg bg-paper border border-hairline p-8 md:p-10 focus:outline-none"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <h2
                                id="external-notice-title"
                                className="font-mono text-xs uppercase tracking-[0.08em] text-signal"
                            >
                                Testing notice
                            </h2>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft hover:text-ink transition-colors duration-150"
                            >
                                Close
                            </button>
                        </div>

                        <h3 className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight">
                            {title} is a prototype
                        </h3>

                        <div className="mt-4 space-y-3 text-base leading-relaxed text-ink/85">
                            <p>
                                {title} is in active testing, not a finished
                                product. Features break, data can be lost, and
                                the app will change without notice.
                            </p>
                            <p>
                                By proceeding you acknowledge that you are using{" "}
                                {title} at your own risk. It is provided without
                                warranty of any kind, and the author accepts no
                                liability for anything that happens while you
                                use it.
                            </p>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-ink px-6 py-3 font-mono text-xs uppercase tracking-[0.08em] text-paper hover:bg-signal transition-colors duration-150"
                            >
                                Accept and continue
                                <span aria-hidden="true">→</span>
                            </a>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft hover:text-ink transition-colors duration-150"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
