import RenderMarkdown from "../../components/markdown";
import { Metadata } from "next";
import { readFileSync } from "fs";
import { join } from "path";
import { pageMetadata } from "../../lib/metadata";
import BackHeader from "../../components/back-header";

export const metadata: Metadata = pageMetadata({
    route: "privacy",
    title: "Privacy Policy",
    description: "Privacy policy for emilkrebs.dev: cookie-free analytics with Simple Analytics, no personal data collected.",
});

const markdown = readFileSync(join(process.cwd(), "src/app/content/privacy.md"), "utf-8");

export default function PrivacyPolicy() {
    return (
        <main id="main" className="flex min-h-screen w-full flex-col items-center justify-start">
            <BackHeader route="privacy" maxWidth="3xl" />
            <section className="w-full max-w-3xl px-6 pt-10 md:pt-16 pb-24">
                <RenderMarkdown content={markdown} />
            </section>
        </main>
    );
}
