import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Not Found",
    robots: {
        index: false,
        follow: false,
    },
};

export default function NotFound() {
    return (
        <html lang="en">
            <body className="min-h-screen flex flex-col bg-paper text-ink antialiased">
                <main id="main" className="flex-1">
                    <section className="mx-auto max-w-[1120px] px-6 py-24 md:py-32">
                        <p className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
                            404 - not in the spec
                        </p>
                        <h1 className="mt-6 text-3xl md:text-4xl font-semibold tracking-tight">
                            This page does not exist.
                        </h1>
                        <p className="mt-4 text-base leading-relaxed text-ink/85 max-w-[52ch]">
                            The address is not part of this document. Head back to the
                            start of the spec.
                        </p>
                        <div className="mt-10">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 font-medium hover:text-signal transition-colors duration-150"
                            >
                                <span className="text-signal" aria-hidden="true">←</span>
                                Back to home
                            </Link>
                        </div>
                    </section>
                </main>
            </body>
        </html>
    );
}
