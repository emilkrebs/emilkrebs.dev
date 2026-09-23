import StoryContent from "../../../content/story.zh.mdx";
import { Metadata } from "next";
import BackHeader from "../../../components/back-header";
import { storyComponents } from "../../../components/story";
import { copy } from "../../../lib/i18n";

export const metadata: Metadata = {
    title: "我的故事",
    description: "Emil Krebs 的个人经历、成长背景与软件工程理念。",
    alternates: {
        canonical: "/zh/story/",
        languages: {
            en: "/story/",
            zh: "/zh/story/",
            "x-default": "/story/",
        },
    },
    openGraph: {
        type: "website",
        locale: "zh_CN",
        url: "https://emilkrebs.dev/zh/story/",
        title: "我的故事 | Emil Krebs",
        description: "Emil Krebs 的个人经历、成长背景与软件工程理念。",
        siteName: "Emil Krebs",
    },
};

const switcher = copy.zh.switcher && { ...copy.zh.switcher, href: "/story" };

export default function ZhStoryPage() {
    return (
        <main id="main" className="flex min-h-screen w-full flex-col items-center justify-start">
            <BackHeader maxWidth="4xl" locale="zh" switcher={switcher} />
            <section className="w-full max-w-4xl px-6 pt-10 md:pt-16 pb-24">
                <StoryContent components={storyComponents.zh} />
            </section>
        </main>
    );
}
