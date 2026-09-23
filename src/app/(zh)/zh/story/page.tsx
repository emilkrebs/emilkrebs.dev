import StoryContent from "../../../content/story.zh.mdx";
import type { Metadata } from "next";
import BackHeader from "../../../components/back-header";
import { JsonLd } from "../../../components/json-ld";
import { storyComponents } from "../../../components/story";
import { pageMetadata } from "../../../lib/metadata";
import { aboutPageSchema } from "../../../lib/structured-data";

const title = "我的故事";
const description = "Emil Krebs 的个人经历、成长背景与软件工程理念。";

export const metadata: Metadata = pageMetadata({ route: "story", locale: "zh", title, description });

export default function ZhStoryPage() {
    return (
        <main id="main" className="flex min-h-screen w-full flex-col items-center justify-start">
            <JsonLd data={aboutPageSchema({ route: "story", locale: "zh", name: title, description })} />
            <BackHeader route="story" maxWidth="4xl" locale="zh" />
            <section className="w-full max-w-4xl px-6 pt-10 md:pt-16 pb-24">
                <StoryContent components={storyComponents.zh} />
            </section>
        </main>
    );
}
