import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Healthstack",
    description:
    "A specialized IDE for health optimization on Eclipse Theia: biomarker tracking, unit conversion, and a purpose-built DSL for intervention protocols. Currently a private dev build.",
};

const HERO_TAGS = [
    "DSL .bio protocols",
    "Timeline planned vs logged",
    "Agents Cortex · Evidence",
    "Units grammar engine",
    "Local-first",
];

interface FeatureSection {
    heading: string;
    title: string;
    proof: string;
    stats: { value: string; label: string }[];
    image: string | null;
    caption: string;
}

const SECTIONS: FeatureSection[] = [
    {
        heading: "Timeline",
        title: "Your entire protocol history on *one axis*.",
        proof:
      "Every protocol, dose, and threshold on one axis: planned against actual, with threshold events armed and crossed, dose dots per phase, and the whole history exportable to your calendar.",
        stats: [
            { value: "218", label: "events" },
            { value: "Planned / actual", label: "layers" },
            { value: "Armed · crossed", label: "threshold" },
            { value: "Per phase", label: "dose dots" },
            { value: ".ics", label: "export" },
        ],
        image: null,
        caption: "Dev build - timeline",
    },
    {
        heading: "Protocol builder",
        title: "Compose protocols like *a graph*, not a spreadsheet.",
        proof:
      "Substances are nodes, synergies and conflicts are edges, and tracks reach from protocol to biomarker. The graph auto-relayouts, and because a protocol is text, it versions in git.",
        stats: [
            { value: "28", label: "entities" },
            { value: "Synergy · conflict", label: "edges" },
            { value: "Track", label: "edges to biomarkers" },
            { value: "Auto", label: "re-layout" },
            { value: "Git", label: "versionable DSL" },
        ],
        image: "/pictures/healthstack-protocol.webp",
        caption: "Dev build - protocol builder",
    },
    {
        heading: "Biomarker tracker",
        title: "Every lab value - *in range, or out*.",
        proof:
      "Each value sits against its reference range with a status: optimal, good, or out. Sparklines show the trend, and units convert as you paste, mg/dL to mmol/L and back.",
        stats: [
            { value: "14", label: "biomarkers" },
            { value: "198", label: "data points" },
            { value: "Optimal · good · out", label: "status" },
            { value: "Sparkline", label: "trends" },
            { value: "mg/dL ↔ mmol/L", label: "units" },
        ],
        image: null,
        caption: "Dev build - biomarker tracker",
    },
    {
        heading: "Trends",
        title: "See *the curve*, not just the number.",
        proof:
      "Multiple markers compared on one chart, range bands drawn over time, event markers where protocols started or ended, values normalized across different labs, and an AI hand-off for analysis.",
        stats: [
            { value: "Multi-marker", label: "comparison" },
            { value: "Range bands", label: "over time" },
            { value: "Event", label: "markers" },
            { value: "0-100%", label: "normalized" },
            { value: "AI", label: "analysis hand-off" },
        ],
        image: null,
        caption: "Dev build - trends",
    },
    {
        heading: "AI agents",
        title: "Cortex orchestrates *your Healthstack*.",
        proof:
      "Agents with roles: Cortex coordinates, Evidence searches PubMed through MCP, BiomarkerAnalyst reads labs, ProtocolPlanner drafts .bio files. Bring your own key, multi-provider.",
        stats: [
            { value: "@Cortex", label: "orchestrator" },
            { value: "@Evidence", label: "MCP · PubMed" },
            { value: "@BiomarkerAnalyst", label: "labs" },
            { value: "@ProtocolPlanner", label: "drafts .bio" },
            { value: "BYO key", label: "multi-provider" },
        ],
        image: null,
        caption: "Dev build - Cortex chat",
    },
];

function SectionHeading({ children }: { children: string }) {
    return (
        <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft mb-10">
            {children}
        </h2>
    );
}

function StatusLabel({ children }: { children: string }) {
    return (
        <span className="border border-hairline px-2 py-1 font-mono text-xs uppercase tracking-[0.08em] text-signal whitespace-nowrap">
            {children}
        </span>
    );
}

function Tag({ children }: { children: string }) {
    return (
        <span className="border border-hairline px-2 py-1 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
            {children}
        </span>
    );
}

function Shot({ src, alt, caption }: { src: string; alt: string; caption: string }) {
    return (
        <figure>
            <div className="relative aspect-[16/10] border border-hairline overflow-hidden bg-paper">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center"
                />
            </div>
            <figcaption className="pt-3 font-mono text-xs uppercase tracking-[0.08em] text-ink/75">
                {caption}
            </figcaption>
        </figure>
    );
}

function StatTable({ stats }: { stats: { value: string; label: string }[] }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-hairline border border-hairline">
            {stats.map((stat) => (
                <div key={stat.label} className="bg-paper-deep p-4">
                    <div className="font-mono text-sm md:text-base text-ink leading-snug">
                        {stat.value}
                    </div>
                    <div className="mt-1 font-mono text-xs uppercase tracking-[0.08em] text-ink/75">
                        {stat.label}
                    </div>
                </div>
            ))}
        </div>
    );
}

function FeatureSection({ section }: { section: FeatureSection }) {
    const [before, accent, after] = section.title.split("*");
    return (
        <section className="mx-auto max-w-[1120px] px-6 py-16 md:py-20 border-t border-hairline">
            <SectionHeading>{section.heading}</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                <div className="md:col-span-5 flex flex-col">
                    <h3 className="text-2xl md:text-3xl font-semibold tracking-tight leading-snug">
                        {before}
                        {accent && (
                            <em className="font-serif italic font-normal">{accent}</em>
                        )}
                        {after}
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-ink/85">
                        {section.proof}
                    </p>
                </div>
                <div className="md:col-span-7">
                    <StatTable stats={section.stats} />
                </div>
            </div>
            <div className="mt-8">
                {section.image && (
                    <Shot
                        src={section.image}
                        alt={`${section.heading} in the Healthstack dev build`}
                        caption={section.caption}
                    />
                )}
            </div>
        </section>
    );
}

export default function HealthstackPage() {
    return (
        <main className="flex-1">
            <div className="mx-auto max-w-[1120px] px-6 pt-10 pb-16">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft hover:text-ink transition-colors duration-150"
                >
                    <span className="text-signal" aria-hidden="true">←</span>
                    Back to home
                </Link>
            </div>

            <section className="mx-auto max-w-[1120px] px-6 pt-4 md:pt-8 pb-16 md:pb-20">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <h1 className="font-bold tracking-[-0.03em] leading-[0.95] text-[clamp(2rem,4.5vw,3.25rem)] max-w-[16ch]">
                        Protocols as code.{" "}
                        <em className="font-serif italic font-normal">
                            Biology as data.
                        </em>{" "}
                        AI as your cortex.
                    </h1>
                    <StatusLabel>Preview - dev build</StatusLabel>
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                    {HERO_TAGS.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                    ))}
                </div>
                <div className="mt-10 md:mt-14">
                    <Shot
                        src="/pictures/healthstack-dashboard.webp"
                        alt="Biomarker dashboard in the Healthstack dev build"
                        caption="Dev build - biomarker dashboard"
                    />
                </div>
            </section>

            {SECTIONS.map((section) => (
                <FeatureSection key={section.heading} section={section} />
            ))}

            <section className="mx-auto max-w-[1120px] px-6 py-16 md:py-20 border-t border-hairline">
                <SectionHeading>The DSL</SectionHeading>
                <p className="text-base md:text-lg leading-relaxed max-w-[62ch] mb-10">
                    Protocols are data, not prose — and the language's type
                    system is written in the language itself:{" "}
                    <code className="font-mono text-sm">substance</code>,{" "}
                    <code className="font-mono text-sm">intervention</code>,{" "}
                    <code className="font-mono text-sm">stack</code>, and{" "}
                    <code className="font-mono text-sm">protocol</code> are
                    user-extendable <code className="font-mono text-sm">type</code>{" "}
                    declarations in <code className="font-mono text-sm">.bio</code>,
                    not hardcoded in the grammar. The editor below runs the real
                    language server in this tab. Nothing leaves your browser.
                    It opens with a sample that defines its own types, then
                    extends them; the other samples cover a curated
                    supplement library and the live interaction checker.
                </p>
                <div className="bg-paper-deep border border-hairline p-8 md:p-10">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-6">
                        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-ink/75">
                            <span
                                className="bg-signal w-[6px] h-[6px] shrink-0"
                                aria-hidden="true"
                            />
                            Playground · .bio language server, runs in your browser
                        </div>
                        <Link
                            href="/playground/"
                            className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft hover:text-ink transition-colors duration-150"
                        >
                            Open full screen · /playground/
                        </Link>
                    </div>
                    <iframe
                        src="/playground/?sample=type-system"
                        title=".bio protocol playground"
                        loading="lazy"
                        className="block w-full h-[480px] md:h-[640px] border border-hairline bg-paper"
                    />
                </div>
            </section>

            <section className="mx-auto max-w-[1120px] px-6 py-16 md:py-24 border-t border-hairline">
                <SectionHeading>Status</SectionHeading>
                <div className="bg-paper-deep border border-hairline p-8 md:p-10">
                    <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
                        Preview build
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-ink/85 max-w-[62ch]">
                        Everything on this page is the dev build: it runs, the
                        DSL compiles, the diagnostics fire. Expect rough edges,
                        no data guarantees, and no product promises. The
                        screenshots are real, taken from the app as it works
                        today. A public preview is not hosted yet; when it is,
                        it will appear here.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                        <Tag>Theia</Tag>
                        <Tag>Langium</Tag>
                        <Tag>TypeScript</Tag>
                        <Tag>Electron</Tag>
                    </div>
                </div>
            </section>
        </main>
    );
}
