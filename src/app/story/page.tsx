import StoryContent from "../content/story.mdx";
import { Metadata } from "next";
import BackHeader from "../components/back-header";

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
        <main id="main" className="flex min-h-screen w-full flex-col items-center justify-start">
            <BackHeader maxWidth="4xl" />
            <section className="w-full max-w-4xl px-6 pt-10 md:pt-16 pb-24">
                <StoryContent />
            </section>
        </main>
    );
}
