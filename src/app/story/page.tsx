import RenderMarkdown from "../components/markdown";
import Link from "next/link";
import { Metadata } from "next";
import { readFileSync } from "fs";
import { join } from "path";

export const metadata: Metadata = {
    title: "My Story",
    description: "The personal journey, background, and software engineering philosophy of Emil Krebs.",
    alternates: {
        canonical: "/story/",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://emilkrebs.dev/story/",
        title: "My Story | Emil Krebs",
        description: "The personal journey, background, and software engineering philosophy of Emil Krebs.",
        siteName: "Emil Krebs",
    },
};

const markdown = readFileSync(join(process.cwd(), "src/app/content/story.md"), "utf-8");

export default function StoryPage() {
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
