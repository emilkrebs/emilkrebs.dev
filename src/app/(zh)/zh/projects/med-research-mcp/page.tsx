import type { Metadata } from "next";
import { ProjectPage, projectLead, projectOgImage } from "../../../../components/project-page";
import { pageMetadata } from "../../../../lib/metadata";

export const metadata: Metadata = pageMetadata({
    route: "project_med_research",
    locale: "zh",
    title: "med-research-mcp",
    description: projectLead("zh"),
    image: projectOgImage("zh"),
});

export default function ZhMedResearchMcpPage() {
    return <ProjectPage locale="zh" />;
}
