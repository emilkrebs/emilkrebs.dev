import type { Metadata } from "next";
import content from "../../../content/med-research-mcp.zh.json";
import BackHeader from "../../../components/back-header";
import { JsonLd } from "../../../components/json-ld";
import {
    FeatureSection,
    InlineText,
    SectionHeading,
    Shot,
    SpecTable,
    StatusSection,
    type Stat,
} from "../../../components/project-page";
import { SmartLink } from "../../../components/smart-link";
import { StatusLabel, Tag } from "../../../components/tag";
import { MED_RESEARCH_MCP_LINKS } from "../../../lib/constants";
import { pageMetadata } from "../../../lib/metadata";
import { projectPageSchema } from "../../../lib/structured-data";

interface SpecTableContent {
    label: string;
    columns: string[];
    /** `` `code` `` renders as inline code. */
    rows: { key: string; value: string }[];
    note: string;
}

interface FeatureContent {
    heading: string;
    /** `*accent*` renders in the serif accent, set upright in Chinese. */
    title: string;
    /** `` `code` `` renders as inline code. */
    proof: string;
    stats: Stat[];
    /** Two stat columns, for values too long for three. */
    wideStats?: boolean;
    table?: SpecTableContent;
}

interface MedResearchContent {
    meta: { title: string; description: string };
    hero: {
        title: string;
        status: string;
        lead: string;
        tags: string[];
        /** Link labels; the demo link shows only when MED_RESEARCH_MCP_LINKS.demo is set. */
        links: { demo: string; source: string; npm: string };
        /** Screenshot path; until one exists, `placeholder` labels the pending plate. */
        image?: string;
        imageAlt: string;
        placeholder: string;
        caption: string;
    };
    sections: FeatureContent[];
    install: { heading: string; body: string; label: string; note: string };
    status: {
        heading: string;
        title: string;
        body: string;
        /** Appended to the body while no demo is set. */
        noDemo: string;
        tags: string[];
        notes: { label: string; body: string }[];
    };
}

const page: MedResearchContent = content;

const { demo: DEMO_URL } = MED_RESEARCH_MCP_LINKS;

// The README's configuration for any MCP client. Its first two install paths,
// Claude Code and Claude Desktop, are not offered in mainland China.
const CLIENT_CONFIG = `{
  "mcpServers": {
    "med-research-mcp": {
      "command": "npx",
      "args": ["-y", "med-research-mcp"],
      "env": { "NCBI_EMAIL": "you@example.com" }
    }
  }
}`;

/** The demo, GitHub and npm: the link-arrows that leave the page. */
const EXIT_LINK_CLASS = "inline-flex items-center gap-2 py-2.5 font-medium hover:text-signal transition-colors duration-150";

export const metadata: Metadata = pageMetadata({
    route: "med-research-mcp",
    locale: "zh",
    title: page.meta.title,
    description: page.meta.description,
});

export default function MedResearchPage() {
    const { hero, install, status } = page;
    return (
        // Pretty wrapping keeps a paragraph or table cell from ending on one lone character.
        <main id="main" className="flex-1 [&_:is(p,td)]:text-pretty">
            <JsonLd
                data={projectPageSchema({
                    route: "med-research-mcp",
                    locale: "zh",
                    name: page.meta.title,
                    description: page.meta.description,
                    image: hero.image,
                })}
            />
            <BackHeader route="med-research-mcp" locale="zh" />

            <section className="mx-auto max-w-280 px-6 pt-10 md:pt-16 pb-16 md:pb-20">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    {/* CJK takes no negative tracking and needs open leading; the claim breaks at its comma, never inside a phrase. */}
                    <h1 className="page-title font-bold leading-[1.2] text-[clamp(2rem,4.5vw,3.25rem)] max-w-[13em] break-keep">
                        {hero.title}
                    </h1>
                    <StatusLabel>{hero.status}</StatusLabel>
                </div>
                <p className="mt-6 max-w-[62ch] text-base md:text-lg leading-relaxed">
                    {hero.lead}
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                    {hero.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                    ))}
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-x-6">
                    {DEMO_URL && (
                        <SmartLink href={DEMO_URL} className={EXIT_LINK_CLASS}>
                            {hero.links.demo}
                            <span className="text-signal" aria-hidden="true">→</span>
                        </SmartLink>
                    )}
                    <SmartLink href={MED_RESEARCH_MCP_LINKS.source} className={EXIT_LINK_CLASS}>
                        {hero.links.source}
                        <span className="text-signal" aria-hidden="true">→</span>
                    </SmartLink>
                    <SmartLink href={MED_RESEARCH_MCP_LINKS.npm} className={EXIT_LINK_CLASS}>
                        {hero.links.npm}
                        <span className="text-signal" aria-hidden="true">→</span>
                    </SmartLink>
                </div>
                <div className="mt-10 md:mt-14">
                    <Shot
                        src={hero.image}
                        alt={hero.imageAlt}
                        caption={hero.caption}
                        placeholder={hero.placeholder}
                        locale="zh"
                    />
                </div>
            </section>

            {page.sections.map((section) => (
                <FeatureSection
                    key={section.heading}
                    heading={section.heading}
                    title={section.title}
                    proof={section.proof}
                    stats={section.stats}
                    wideStats={section.wideStats}
                    locale="zh"
                >
                    {section.table && (
                        <>
                            <SpecTable
                                label={section.table.label}
                                columns={section.table.columns}
                                rows={section.table.rows}
                                locale="zh"
                            />
                            <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-ink-soft">
                                {section.table.note}
                            </p>
                        </>
                    )}
                </FeatureSection>
            ))}

            <section id="install" className="mx-auto max-w-280 px-6 py-16 md:py-20 border-t border-hairline">
                <SectionHeading>{install.heading}</SectionHeading>
                <p className="text-base md:text-lg leading-relaxed max-w-[62ch] mb-10">
                    <InlineText text={install.body} locale="zh" />
                </p>
                <div className="bg-paper-deep border border-hairline p-8 md:p-10">
                    <div className="flex items-center gap-2 pb-6 font-mono text-xs uppercase tracking-[0.08em] text-ink/75">
                        <span
                            className="bg-signal w-1.5 h-1.5 shrink-0"
                            aria-hidden="true"
                        />
                        {install.label}
                    </div>
                    {/* Code keeps its own spacing: no CJK tracking or leading. */}
                    <pre className="overflow-x-auto border border-hairline bg-paper p-6 font-mono text-sm leading-6 tracking-normal text-ink">
                        <code>{CLIENT_CONFIG}</code>
                    </pre>
                </div>
                <p className="mt-6 max-w-[62ch] text-sm leading-relaxed text-ink-soft">
                    <InlineText text={install.note} locale="zh" />
                </p>
            </section>

            <StatusSection
                heading={status.heading}
                title={status.title}
                // Chinese sentences join without a space.
                body={DEMO_URL ? status.body : `${status.body}${status.noDemo}`}
                tags={status.tags}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {status.notes.map((note) => (
                        <div key={note.label}>
                            <h3 className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
                                {note.label}
                            </h3>
                            <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-ink/85">
                                {note.body}
                            </p>
                        </div>
                    ))}
                </div>
            </StatusSection>
        </main>
    );
}
