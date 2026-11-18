import type { Metadata } from "next";
import { ProjectPage, projectLead, projectOgImage } from "../../components/project-page";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata({
    route: "project_med_research",
    title: "med-research-mcp",
    description: projectLead("en"),
    image: projectOgImage("en"),
});

export default function MedResearchMcpPage() {
    return <ProjectPage locale="en" />;
}
