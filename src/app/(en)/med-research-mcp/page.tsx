import type { Metadata } from "next";
import content from "../../content/med-research-mcp.json";
import BackHeader from "../../components/back-header";
import { JsonLd } from "../../components/json-ld";
import {
    BarPanels,
    DataTable,
    FeatureSection,
    InlineText,
    ProseSection,
    RowsSection,
    SectionHeading,
    ShareChart,
    Shot,
    SpecTable,
    StatusSection,
    type BarPanel,
    type DataRow,
    type ShareRow,
    type Stat,
} from "../../components/project-page";
import { SmartLink } from "../../components/smart-link";
import { StatusLabel, Tag } from "../../components/tag";
import { MED_RESEARCH_MCP_LINKS } from "../../lib/constants";
import { pageMetadata } from "../../lib/metadata";
import { projectPageSchema } from "../../lib/structured-data";

interface SpecTableContent {
    label: string;
    columns: string[];
    /** `` `code` `` renders as inline code. */
    rows: { key: string; value: string }[];
    note: string;
}

interface FeatureContent {
    heading: string;
    /** `*accent*` renders in the serif italic. */
    title: string;
    /** `` `code` `` renders as inline code. */
    proof: string;
    stats: Stat[];
    /** Two stat columns, for values too long for three. */
    wideStats?: boolean;
    table?: SpecTableContent;
    /** Measured results, charted and tabled, with a note on how they were measured. */
    results?: ResultsContent;
}

interface ResultsContent {
    label: string;
    /** The row-header column, then one per condition: the baseline, then with the server. */
    columns: string[];
    /** The conditions' short names, beside the bars. */
    short: string[];
    /** What the charts tell assistive technology in place of the drawing. */
    chartNote: string;
    /** Counts out of a sample: charted as shares, tabled as "x of n". */
    shares: { title: string; rows: { label: string; meta: string; values: { count: number; of: number }[] }[] };
    /** Means in a unit each: charted one panel per measure. */
    measures: { title: string; rows: { label: string; meta: string; unit: string; decimals: number; values: number[] }[] };
    note: string;
}

interface ConfigContent {
    label: string;
    /** `` `code` `` renders as inline code. */
    note: string;
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
        /** Plate path; without one, `placeholder` labels the pending plate. */
        image?: string;
        imageAlt: string;
        placeholder: string;
        caption: string;
    };
    problem: { heading: string; title: string; paragraphs: string[] };
    audience: { heading: string; rows: { title: string; body: string }[] };
    sections: FeatureContent[];
    usage: {
        heading: string;
        install: {
            title: string;
            /** `` `code` `` renders as inline code. */
            body: string;
            claudeCode: ConfigContent;
            clients: ConfigContent;
            /** `` `code` `` renders as inline code. */
            note: string;
        };
        ask: { title: string; body: string; examples: { prompt: string; note?: string }[] };
        check: { title: string; body: string };
    };
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

// The README's install paths, verbatim: Claude Code first, then the
// configuration any other MCP client takes.
const CLAUDE_CODE_COMMAND = `claude mcp add med-research-mcp -s user \\
  -e NCBI_EMAIL=you@example.com \\
  -- npx -y med-research-mcp`;

const CLIENT_CONFIG = `{
  "mcpServers": {
    "med-research-mcp": {
      "command": "npx",
      "args": ["-y", "med-research-mcp"],
      "env": { "NCBI_EMAIL": "you@example.com" }
    }
  }
}`;

// JPEG copy of the mark plate: link unfurlers do not reliably render WebP.
const OG_IMAGE = {
    url: "/og/med-research-mcp.jpg",
    width: 1200,
    height: 630,
    alt: page.hero.imageAlt,
};

const formatCount = ({ count, of }: { count: number; of: number }) => `${count} of ${of}`;

function formatMeasure(value: number, decimals: number, unit: string) {
    return `${value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${unit}`;
}

/** The axis end: the first round number at least 5% above the largest value. */
function axisMax(value: number) {
    const target = value * 1.05;
    const power = 10 ** Math.floor(Math.log10(target));
    return [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].map((step) => step * power).find((end) => end >= target) ?? target;
}

/** Axis labels compact from 1,000 up: 40,000 reads 40K. */
const formatTick = (value: number, unit: string) => `${value >= 1000 ? `${value / 1000}K` : value}${unit}`;

function shareRows(results: ResultsContent): ShareRow[] {
    return results.shares.rows.map((row) => ({
        label: row.label,
        meta: row.meta,
        points: row.values.map((value) => ({ at: value.count / value.of, label: formatCount(value) })),
    }));
}

function barPanels(results: ResultsContent): BarPanel[] {
    return results.measures.rows.map((row) => {
        const max = axisMax(Math.max(...row.values));
        return {
            label: row.label,
            meta: row.meta,
            ticks: [formatTick(0, row.unit), formatTick(max, row.unit)],
            bars: row.values.map((value) => ({ at: value / max, label: formatMeasure(value, row.decimals, row.unit) })),
        };
    });
}

/** The table view of both charts: every value, with its sample. */
function dataRows(results: ResultsContent): DataRow[] {
    return [
        ...results.shares.rows.map((row) => ({ label: row.label, meta: row.meta, values: row.values.map(formatCount) })),
        ...results.measures.rows.map((row) => ({
            label: row.label,
            meta: row.meta,
            values: row.values.map((value) => formatMeasure(value, row.decimals, row.unit)),
        })),
    ];
}

/** The demo, GitHub and npm: the link-arrows that leave the page. */
const EXIT_LINK_CLASS = "inline-flex items-center gap-2 py-2.5 font-medium hover:text-signal transition-colors duration-150";

export const metadata: Metadata = pageMetadata({
    route: "med-research-mcp",
    locale: "en",
    title: page.meta.title,
    description: page.meta.description,
    image: OG_IMAGE,
});

function ExitLink({ href, children }: { href: string; children: string }) {
    return (
        <SmartLink href={href} className={EXIT_LINK_CLASS}>
            {children}
            <span className="text-signal" aria-hidden="true">→</span>
        </SmartLink>
    );
}

/** One install path inside the box: mono label with a signal token, the code, a small note. */
function ConfigBlock({ label, code, note }: { label: string; code: string; note: string }) {
    return (
        <div>
            <div className="flex items-center gap-2 pb-4 font-mono text-xs uppercase tracking-[0.08em] text-ink/75">
                <span className="bg-signal w-1.5 h-1.5 shrink-0" aria-hidden="true" />
                {label}
            </div>
            <pre className="overflow-x-auto border border-hairline bg-paper p-4 md:p-6 font-mono text-sm leading-6 text-ink">
                <code>{code}</code>
            </pre>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                <InlineText text={note} locale="en" />
            </p>
        </div>
    );
}

/** One step of the usage list: its number and title on the left, the matter on the right, on the 5/7 grid. */
function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
    return (
        <li className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
            <h3 className="md:col-span-5 text-2xl md:text-3xl font-semibold tracking-tight flex items-baseline gap-4">
                <span className="font-mono text-sm font-normal text-ink-soft" aria-hidden="true">{number}</span>
                {title}
            </h3>
            <div className="md:col-span-7 min-w-0">{children}</div>
        </li>
    );
}

export default function MedResearchPage() {
    const { hero, problem, audience, usage, status } = page;
    return (
        // Pretty wrapping keeps a paragraph or table cell from ending on one lone word;
        // balanced headlines keep a section title from leaving one on its last line.
        <main id="main" className="flex-1 [&_:is(p,td)]:text-pretty [&_h3]:text-balance">
            <JsonLd
                data={projectPageSchema({
                    route: "med-research-mcp",
                    locale: "en",
                    name: page.meta.title,
                    description: page.meta.description,
                    image: hero.image,
                })}
            />
            <BackHeader route="med-research-mcp" locale="en" />

            <section className="mx-auto max-w-280 px-6 pt-10 md:pt-16 pb-16 md:pb-20">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <h1 className="font-bold tracking-[-0.03em] leading-[0.95] text-[clamp(2rem,4.5vw,3.25rem)] max-w-[16ch] text-balance">
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
                    {DEMO_URL && <ExitLink href={DEMO_URL}>{hero.links.demo}</ExitLink>}
                    <ExitLink href={MED_RESEARCH_MCP_LINKS.source}>{hero.links.source}</ExitLink>
                    <ExitLink href={MED_RESEARCH_MCP_LINKS.npm}>{hero.links.npm}</ExitLink>
                </div>
                <div className="mt-10 md:mt-14">
                    <Shot
                        src={hero.image}
                        alt={hero.imageAlt}
                        caption={hero.caption}
                        placeholder={hero.placeholder}
                        locale="en"
                    />
                </div>
            </section>

            <ProseSection heading={problem.heading} title={problem.title} paragraphs={problem.paragraphs} />

            <RowsSection heading={audience.heading} rows={audience.rows} />

            {page.sections.map((section) => (
                <FeatureSection
                    key={section.heading}
                    heading={section.heading}
                    title={section.title}
                    proof={section.proof}
                    stats={section.stats}
                    wideStats={section.wideStats}
                    locale="en"
                >
                    {section.table && (
                        <>
                            <SpecTable
                                label={section.table.label}
                                columns={section.table.columns}
                                rows={section.table.rows}
                                locale="en"
                            />
                            <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-ink-soft">
                                {section.table.note}
                            </p>
                        </>
                    )}
                    {section.results && (
                        <div className="flex flex-col gap-6">
                            <ShareChart
                                title={section.results.shares.title}
                                legend={section.results.columns.slice(1)}
                                description={section.results.chartNote}
                                rows={shareRows(section.results)}
                            />
                            <BarPanels
                                title={section.results.measures.title}
                                legend={section.results.columns.slice(1)}
                                short={section.results.short}
                                description={section.results.chartNote}
                                panels={barPanels(section.results)}
                            />
                            <div>
                                <DataTable
                                    label={section.results.label}
                                    columns={section.results.columns}
                                    rows={dataRows(section.results)}
                                />
                                <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-ink-soft">
                                    {section.results.note}
                                </p>
                            </div>
                        </div>
                    )}
                </FeatureSection>
            ))}

            <section id="usage" className="mx-auto max-w-280 px-6 py-16 md:py-20 border-t border-hairline">
                <SectionHeading>{usage.heading}</SectionHeading>
                <ol className="flex flex-col gap-14 md:gap-16">
                    <Step number={1} title={usage.install.title}>
                        <p className="max-w-[62ch] text-base md:text-lg leading-relaxed text-ink/85">
                            <InlineText text={usage.install.body} locale="en" />
                        </p>
                        <div className="mt-8 bg-paper-deep border border-hairline p-5 md:p-8 flex flex-col gap-10">
                            <ConfigBlock
                                label={usage.install.claudeCode.label}
                                code={CLAUDE_CODE_COMMAND}
                                note={usage.install.claudeCode.note}
                            />
                            <ConfigBlock
                                label={usage.install.clients.label}
                                code={CLIENT_CONFIG}
                                note={usage.install.clients.note}
                            />
                        </div>
                        <p className="mt-6 max-w-[62ch] text-sm leading-relaxed text-ink-soft">
                            <InlineText text={usage.install.note} locale="en" />
                        </p>
                    </Step>
                    <Step number={2} title={usage.ask.title}>
                        <p className="max-w-[62ch] text-base md:text-lg leading-relaxed text-ink/85">
                            {usage.ask.body}
                        </p>
                        <ul className="mt-6 border-t border-hairline">
                            {usage.ask.examples.map((example) => (
                                <li key={example.prompt} className="border-b border-hairline py-4">
                                    <p className="max-w-[62ch] text-base md:text-lg leading-relaxed text-ink">
                                        <q>{example.prompt}</q>
                                    </p>
                                    {example.note && (
                                        <p className="mt-1 max-w-[62ch] text-sm leading-relaxed text-ink-soft">
                                            {example.note}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </Step>
                    <Step number={3} title={usage.check.title}>
                        <p className="max-w-[62ch] text-base md:text-lg leading-relaxed text-ink/85">
                            {usage.check.body}
                        </p>
                    </Step>
                </ol>
            </section>

            <StatusSection
                heading={status.heading}
                title={status.title}
                body={DEMO_URL ? status.body : `${status.body} ${status.noDemo}`}
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
