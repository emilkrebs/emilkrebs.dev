import StoryContent from "../../content/story.mdx";
import type { Metadata } from "next";
import BackHeader from "../../components/back-header";
import { JsonLd } from "../../components/json-ld";
import { pageMetadata } from "../../lib/metadata";
import { aboutPageSchema } from "../../lib/structured-data";

const title = "My Story";
const description = "The personal journey, background, and software engineering philosophy of Emil Krebs.";

export const metadata: Metadata = pageMetadata({ route: "story", locale: "en", title, description });

export default function StoryPage() {
    return (
        <main id="main" className="flex min-h-screen w-full flex-col items-center justify-start">
            <JsonLd data={aboutPageSchema({ route: "story", locale: "en", name: title, description })} />
            <BackHeader route="story" maxWidth="4xl" />
            <section className="w-full max-w-4xl px-6 pt-10 md:pt-16 pb-24">
                <StoryContent />
            </section>
        </main>
    );
}
