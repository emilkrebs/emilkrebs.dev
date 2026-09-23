import type { Metadata } from "next";
import { Landing } from "../../components/landing";
import { copy } from "../../lib/i18n";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata({
    route: "home",
    locale: "zh",
    description: copy.zh.meta.description,
});

export default function ZhPage() {
    return <Landing locale="zh" />;
}
