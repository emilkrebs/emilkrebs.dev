import RenderMarkdown from "../components/markdown";
import Link from "next/link";
import { Metadata } from "next";
import { readFileSync } from "fs";
import { join } from "path";
import { EMAIL_ADDRESS, PHONE_NUMBER } from "../lib/constants";

export const metadata: Metadata = {
    title: "Imprint",
    alternates: {
        canonical: "/imprint/",
    },
};

const markdown = readFileSync(join(process.cwd(), "src/app/content/imprint.md"), "utf-8")
    .replaceAll("{{EMAIL_ADDRESS}}", EMAIL_ADDRESS)
    .replaceAll("{{PHONE_NUMBER}}", PHONE_NUMBER);

export default function Imprint() {
    return (
        <main id="main" className="flex min-h-screen w-full flex-col items-center justify-start px-6">
            <div className="w-full max-w-3xl my-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft hover:text-ink transition-colors duration-150"
                >
                    <span className="text-signal" aria-hidden="true">←</span>
                    Back to home
                </Link>
            </div>
            <section className="w-full max-w-3xl pb-24">
                <RenderMarkdown content={markdown} />
            </section>
        </main>
    );
}
