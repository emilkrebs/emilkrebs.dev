import StoryContent from "../content/story.mdx";
import Link from "next/link";
import { Metadata } from "next";

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

export default function StoryPage() {
    return (
        <main id="main" className="flex min-h-screen w-full flex-col items-center justify-start px-6">
            {/*
THESIS: The story of a person told as a printed specification: title block, four-cell stat table, a table of contents, then six era sections on a timeline rail, each era's claims proven by the product plates it produced. Refuses the blog-post timeline of date-prefixed paragraphs and the resume of job bullets.
OWN-WORLD: paper #f7f5f0, ink #141310, ink-soft #5f5b55, signal #e8450c, hairline grammar, Schibsted Grotesk headline scale, IBM Plex Mono labels for all metadata, one Instrument Serif italic accent phrase per era, 6px square signal token marks, 0px corners everywhere, full-color product plates with mono captions naming the live origin.
STORY: The visitor reads the spec sheet of a life: what Emil was at ten, what he built through school, and what he is building now, with every claim pinned to a real artifact and a real link.
FIRST VIEWPORT: mono back link, the page title at display-adjacent scale, one mono lead line, the thesis sentence, a token mark row, the stat table, and the Contents block; the timeline begins below the fold.
FORM: a spec-document surface inside the established Spec Sheet world: front matter, contents, versioned body sections on a rail, closing pull quote. Pinned by the user's layout choice: vertical timeline with eras, projects placed per era.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md.
*/}
            <div className="w-full max-w-4xl my-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft hover:text-ink transition-colors duration-150"
                >
                    <span className="text-signal" aria-hidden="true">←</span>
                    Back to home
                </Link>
            </div>
            <section className="w-full max-w-4xl pb-24">
                <StoryContent />
            </section>
        </main>
    );
}
