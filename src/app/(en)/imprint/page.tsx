import RenderMarkdown from "../../components/markdown";
import { Metadata } from "next";
import { readFileSync } from "fs";
import { join } from "path";
import { EMAIL_ADDRESS, PHONE_NUMBER } from "../../lib/constants";
import BackHeader from "../../components/back-header";

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
        <main id="main" className="flex min-h-screen w-full flex-col items-center justify-start">
            <BackHeader maxWidth="3xl" />
            <section className="w-full max-w-3xl px-6 pt-10 md:pt-16 pb-24">
                <RenderMarkdown content={markdown} />
            </section>
        </main>
    );
}
