import Image from "next/image";
import { PlaceholderPlate } from "./placeholder-plate";
import { Tag } from "./tag";
import type { Locale } from "../lib/i18n";
import { FULL_WIDTH_SIZES } from "../lib/image-sizes";

/**
 * The grammar the project pages share (/healthstack, /med-research-mcp):
 * mono section headings, feature sections with a spec-style stat table,
 * prose and row sections, screenshot plates, spec and data tables, charts,
 * and the closing status block.
 */

export interface Stat {
    value: string;
    label: string;
}

/**
 * Plain text with `*accent*` in the serif accent and `` `code` `` as inline
 * code. CJK has no true italic: the zh accent contrasts by the serif face alone.
 */
export function InlineText({ text, locale = "en" }: { text: string; locale?: Locale }) {
    return text.split(/(\*[^*]+\*|`[^`]+`)/).map((part, i) => {
        if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) {
            return (
                <em key={i} className={`font-serif ${locale === "zh" ? "not-italic" : "italic"} font-normal`}>
                    {part.slice(1, -1)}
                </em>
            );
        }
        if (part.length > 2 && part.startsWith("`") && part.endsWith("`")) {
            return <code key={i} className="font-mono text-sm">{part.slice(1, -1)}</code>;
        }
        return part;
    });
}

export function SectionHeading({ children }: { children: string }) {
    return (
        <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft mb-10">
            {children}
        </h2>
    );
}

interface ShotProps {
    src?: string;
    alt: string;
    caption: string;
    placeholder?: string;
    locale?: Locale;
}

/** A 16:10 screenshot plate with its mono caption; the pending plate until a screenshot exists. */
export function Shot({ src, alt, caption, placeholder, locale = "en" }: ShotProps) {
    return (
        <figure>
            <div className="relative aspect-16/10 border border-hairline overflow-hidden bg-paper">
                {src ? (
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        sizes={FULL_WIDTH_SIZES}
                        className="object-cover object-center"
                    />
                ) : (
                    <PlaceholderPlate label={placeholder ?? ""} locale={locale} />
                )}
            </div>
            <figcaption className="pt-3 font-mono text-xs uppercase tracking-[0.08em] text-ink/75">
                {caption}
            </figcaption>
        </figure>
    );
}

/**
 * Spec-style stats in hairline cells, three across on wide screens. `wide`
 * sets two across from sm up and one below, for values too long for a third
 * of the column (code identifiers would otherwise break at their hyphens).
 */
export function StatTable({ stats, wide = false }: { stats: Stat[]; wide?: boolean }) {
    // Empty cells close the last row: to a multiple of 6 so both 2 and 3 across close.
    const fill = wide ? stats.length % 2 : (6 - (stats.length % 6)) % 6;
    return (
        <div className={`grid ${wide ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 lg:grid-cols-3"} gap-px bg-hairline border border-hairline`}>
            {stats.map((stat) => (
                <div key={stat.label} className="min-w-0 bg-paper-deep p-4 [overflow-wrap:anywhere]">
                    <div className="font-mono text-sm md:text-base text-ink leading-snug">
                        {stat.value}
                    </div>
                    <div className="mt-1 font-mono text-xs uppercase tracking-[0.08em] text-ink/75">
                        {stat.label}
                    </div>
                </div>
            ))}
            {Array.from({ length: fill }).map((_, i) => (
                <div
                    key={`fill-${i}`}
                    aria-hidden="true"
                    className={`bg-paper-deep p-4${wide ? " hidden sm:block" : ""}`}
                />
            ))}
        </div>
    );
}

interface SpecTableProps {
    /** The table's accessible name. */
    label: string;
    /** Two headers: the key column, then the description. */
    columns: string[];
    /** `` `code` `` and `*accent*` render in each description. */
    rows: { key: string; value: string }[];
    locale?: Locale;
}

/**
 * A two-column spec table: a mono key per row and a sentence about it, in
 * the stat table's hairline grammar. The key column takes only the width
 * its longest key needs, so the sentences keep the room on a phone.
 */
export function SpecTable({ label, columns, rows, locale = "en" }: SpecTableProps) {
    return (
        <table className="w-full border-collapse border border-hairline bg-paper-deep text-left">
            <caption className="sr-only">{label}</caption>
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th
                            key={column}
                            scope="col"
                            className="border-l border-hairline first:border-l-0 px-4 py-3 whitespace-nowrap font-mono text-xs font-normal uppercase tracking-[0.08em] text-ink/75"
                        >
                            {column}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row) => (
                    <tr key={row.key} className="border-t border-hairline">
                        <th
                            scope="row"
                            className="w-px whitespace-nowrap px-4 py-4 align-top font-mono text-sm md:text-base font-normal text-ink"
                        >
                            {row.key}
                        </th>
                        <td className="border-l border-hairline px-4 py-4 align-top text-sm md:text-base leading-relaxed text-ink/85">
                            <InlineText text={row.value} locale={locale} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

interface FeatureSectionProps {
    heading: string;
    /** `*accent*` renders in the serif accent. */
    title: string;
    /** `` `code` `` renders as inline code. */
    proof: string;
    stats: Stat[];
    /** Two stat columns at every width, for long values (see StatTable). */
    wideStats?: boolean;
    locale?: Locale;
    /** Full-width matter under the text and stats: a screenshot plate, a spec table. */
    children?: React.ReactNode;
}

/** One capability: mono heading, headline, proof sentence, and stat table, with optional matter below. */
export function FeatureSection({ heading, title, proof, stats, wideStats, locale = "en", children }: FeatureSectionProps) {
    return (
        <section className="mx-auto max-w-280 px-6 py-16 md:py-20 border-t border-hairline">
            <SectionHeading>{heading}</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                <div className="md:col-span-5 flex flex-col">
                    {/* Chinese headlines break at punctuation, never inside a phrase. */}
                    <h3 className={`text-2xl md:text-3xl font-semibold tracking-tight leading-snug${locale === "zh" ? " break-keep" : ""}`}>
                        <InlineText text={title} locale={locale} />
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-ink/85">
                        <InlineText text={proof} locale={locale} />
                    </p>
                </div>
                <div className="md:col-span-7">
                    <StatTable stats={stats} wide={wideStats} />
                </div>
            </div>
            {children && <div className="mt-8">{children}</div>}
        </section>
    );
}

interface ProseSectionProps {
    heading: string;
    /** `*accent*` renders in the serif accent. */
    title: string;
    /** One paragraph each; `` `code` `` renders as inline code. */
    paragraphs: string[];
    locale?: Locale;
}

/** An argument in prose: the headline beside its paragraphs, on the feature sections' 5/7 grid. */
export function ProseSection({ heading, title, paragraphs, locale = "en" }: ProseSectionProps) {
    return (
        <section className="mx-auto max-w-280 px-6 py-16 md:py-20 border-t border-hairline">
            <SectionHeading>{heading}</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                <h3 className={`md:col-span-5 text-2xl md:text-3xl font-semibold tracking-tight leading-snug${locale === "zh" ? " break-keep" : ""}`}>
                    <InlineText text={title} locale={locale} />
                </h3>
                <div className="md:col-span-7 flex flex-col gap-4">
                    {paragraphs.map((paragraph) => (
                        <p key={paragraph} className="max-w-[62ch] text-base md:text-lg leading-relaxed text-ink/85">
                            <InlineText text={paragraph} locale={locale} />
                        </p>
                    ))}
                </div>
            </div>
        </section>
    );
}

interface Row {
    title: string;
    /** `` `code` `` renders as inline code. */
    body: string;
}

/** Short statements in the landing's "What I do" grammar: a signal token and headline, its sentence beside it. */
export function RowsSection({ heading, rows, locale = "en" }: { heading: string; rows: Row[]; locale?: Locale }) {
    return (
        <section className="mx-auto max-w-280 px-6 py-16 md:py-20 border-t border-hairline">
            <SectionHeading>{heading}</SectionHeading>
            <div className="flex flex-col gap-10 md:gap-14">
                {rows.map((row) => (
                    <div key={row.title} className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8">
                        <h3 className="md:col-span-5 text-2xl md:text-3xl font-semibold tracking-tight flex items-start gap-3">
                            <span className="mt-3 size-1.5 bg-signal shrink-0" aria-hidden="true" />
                            {row.title}
                        </h3>
                        <p className="md:col-span-7 max-w-[62ch] text-base md:text-lg leading-relaxed text-ink/85">
                            <InlineText text={row.body} locale={locale} />
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export interface DataRow {
    label: string;
    /** The sample behind the row, as a mono line under its label. */
    meta?: string;
    values: string[];
}

interface DataTableProps {
    /** The table's accessible name. */
    label: string;
    /** The row-header column first, then one per value. */
    columns: string[];
    rows: DataRow[];
}

/**
 * Measured results in the spec table's hairline grammar: a row header (what
 * was measured, and on how many answers) and mono values set flush right in
 * tabular figures, so the columns compare at a glance. On a phone the value
 * headers wrap instead of the table scrolling.
 */
export function DataTable({ label, columns, rows }: DataTableProps) {
    const [rowColumn, ...valueColumns] = columns;
    const header = "px-3 md:px-4 py-3 align-bottom font-mono text-xs font-normal uppercase tracking-[0.04em] sm:tracking-[0.08em] text-ink/75";
    return (
        <table className="w-full border-collapse border border-hairline bg-paper-deep text-left">
            <caption className="sr-only">{label}</caption>
            <thead>
                <tr>
                    <th scope="col" className={header}>{rowColumn}</th>
                    {valueColumns.map((column) => (
                        <th key={column} scope="col" className={`${header} w-22 md:w-48 border-l border-hairline text-right`}>
                            {column}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row) => (
                    <tr key={row.label} className="border-t border-hairline">
                        <th scope="row" className="px-3 md:px-4 py-4 align-top font-normal">
                            <span className="block text-sm md:text-base leading-snug text-ink">{row.label}</span>
                            {row.meta && (
                                <span className="mt-1.5 block font-mono text-xs uppercase tracking-[0.04em] sm:tracking-[0.08em] text-ink/75">
                                    {row.meta}
                                </span>
                            )}
                        </th>
                        {row.values.map((value, index) => (
                            <td
                                key={valueColumns[index]}
                                className="border-l border-hairline px-3 md:px-4 py-4 align-top text-right font-mono text-sm md:text-base tabular-nums text-ink"
                            >
                                {/* On the span, not the cell: a page's pretty wrapping of table cells would reset the cell's wrap mode. */}
                                <span className="whitespace-nowrap">{value}</span>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export interface ChartPoint {
    /** Position on the axis, 0 to 1. */
    at: number;
    /** The value as the reader reads it ("12 of 12", "10.0 s"). */
    label: string;
}

/**
 * The two conditions a chart compares, in legend order: the baseline in
 * ink-soft, the condition the page is about in signal, as the system's square
 * token. Color follows the condition in every chart on the page.
 */
const CONDITION_FILL = ["bg-ink-soft", "bg-signal"];
const CONDITION_TEXT = ["text-ink-soft", "text-ink"];

/** Axis ticks keep their units' case ("15 s"); labels are set in caps. */
const CHART_TICK = "font-mono text-xs tracking-[0.04em] sm:tracking-[0.08em] text-ink/75";
const CHART_LABEL = `${CHART_TICK} uppercase`;
/** Value labels sit on the chart ground, so a gridline behind them never runs through the figures. */
const VALUE_LABEL = "whitespace-nowrap bg-paper-deep px-1 font-mono";

interface ChartFrameProps {
    title: string;
    /** One name per condition, in legend order. */
    legend: string[];
    /** Read in place of the drawing: where the same numbers are as text. */
    description: string;
    children: React.ReactNode;
}

/**
 * A figure in the table grammar: a mono title and the legend in a header row,
 * the drawing below on paper-deep. The drawing is hidden from assistive
 * technology; the data table under the figures is its text equivalent.
 */
function ChartFrame({ title, legend, description, children }: ChartFrameProps) {
    return (
        <figure className="border border-hairline bg-paper-deep">
            <figcaption className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-hairline px-4 py-3">
                <span className={CHART_LABEL}>{title}</span>
                <span className="flex flex-wrap gap-x-5 gap-y-1">
                    {legend.map((name, index) => (
                        <span key={name} className={`flex items-center gap-2 ${CHART_LABEL}`}>
                            <span className={`size-2 shrink-0 ${CONDITION_FILL[index]}`} aria-hidden="true" />
                            {name}
                        </span>
                    ))}
                </span>
                <span className="sr-only">{description}</span>
            </figcaption>
            <div aria-hidden="true">{children}</div>
        </figure>
    );
}

/** Measure and sample, as the data table sets its row headers. */
function ChartRowLabel({ label, meta }: { label: string; meta?: string }) {
    return (
        <div>
            <div className="text-sm md:text-base leading-snug text-ink">{label}</div>
            {meta && <div className={`mt-1.5 ${CHART_LABEL}`}>{meta}</div>}
        </div>
    );
}

/** Where a label sits against its mark: inward at either end of the axis, centred between. */
function anchorClass(at: number) {
    if (at < 0.15) return "";
    if (at > 0.85) return "-translate-x-full";
    return "-translate-x-1/2";
}

const SHARE_TICKS = [0, 0.25, 0.5, 0.75, 1];

export interface ShareRow {
    label: string;
    meta?: string;
    /** One point per condition, in legend order. */
    points: ChartPoint[];
}

interface ShareChartProps {
    title: string;
    legend: string[];
    description: string;
    rows: ShareRow[];
}

/**
 * Shares of 0 to 100%, one row per measure: each condition a square mark on
 * one axis, a hairline between the two, the value labelled once beside each
 * mark. Marks that coincide nest (the baseline frames the other) and share
 * one label; labels too close to sit side by side split above and below.
 */
export function ShareChart({ title, legend, description, rows }: ShareChartProps) {
    return (
        <ChartFrame title={title} legend={legend} description={description}>
            <div className="px-4">
                {rows.map((row) => {
                    const [base, other] = row.points;
                    const together = Math.abs(base.at - other.at) < 0.02;
                    const split = !together && Math.abs(base.at - other.at) < 0.3;
                    const low = Math.min(base.at, other.at);
                    const high = Math.max(base.at, other.at);
                    return (
                        <div
                            key={row.label}
                            className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-center gap-x-8 gap-y-2 border-b border-hairline py-4"
                        >
                            <ChartRowLabel label={row.label} meta={row.meta} />
                            <div className="relative h-14">
                                {/* Positions run inside a 5px inset, so a mark at 0 or 100% stays whole. */}
                                <div className="absolute inset-y-0 inset-x-[5px]">
                                    {SHARE_TICKS.map((tick) => (
                                        <span key={tick} className="absolute inset-y-0 w-px bg-hairline" style={{ left: `${tick * 100}%` }} />
                                    ))}
                                    <span
                                        className="absolute top-8 h-0.5 -translate-y-1/2 bg-ink/25"
                                        style={{ left: `${low * 100}%`, width: `${(high - low) * 100}%` }}
                                    />
                                    {row.points.map((point, index) => (
                                        <span
                                            key={legend[index]}
                                            title={`${legend[index]}: ${point.label}`}
                                            className="absolute top-8 grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center"
                                            style={{ left: `${point.at * 100}%` }}
                                        >
                                            <span className={`${together ? (index === 0 ? "size-3.5" : "size-2 absolute") : "size-2.5"} ${CONDITION_FILL[index]}`} />
                                        </span>
                                    ))}
                                    {together ? (
                                        <span
                                            className={`absolute top-0 ${VALUE_LABEL} text-xs ${CONDITION_TEXT[1]} ${anchorClass(base.at)}`}
                                            style={{ left: `${base.at * 100}%` }}
                                        >
                                            {base.label} · {other.label}
                                        </span>
                                    ) : (
                                        row.points.map((point, index) => (
                                            <span
                                                key={legend[index]}
                                                className={`absolute ${split && index === 0 ? "top-10" : "top-0"} ${VALUE_LABEL} text-xs ${CONDITION_TEXT[index]} ${anchorClass(point.at)}`}
                                                style={{ left: `${point.at * 100}%` }}
                                            >
                                                {point.label}
                                            </span>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-x-8 py-3">
                    <div className="hidden md:block" />
                    <div className="relative h-4 mx-[5px]">
                        {SHARE_TICKS.map((tick) => (
                            <span
                                key={tick}
                                className={`absolute top-0 ${CHART_TICK} ${anchorClass(tick)}${tick === 0.25 || tick === 0.75 ? " hidden sm:block" : ""}`}
                                style={{ left: `${tick * 100}%` }}
                            >
                                {tick * 100}%
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </ChartFrame>
    );
}

export interface BarPanel {
    label: string;
    meta?: string;
    /** Labels for the axis ends, 0 and the panel's maximum. */
    ticks: [string, string];
    /** One bar per condition, in legend order; `at` is the value over the panel's maximum. */
    bars: ChartPoint[];
}

interface BarPanelsProps {
    title: string;
    legend: string[];
    /** Short condition names beside the bars. */
    short: string[];
    description: string;
    panels: BarPanel[];
}

/**
 * Measures in different units as small multiples, never on one shared axis:
 * one panel and one scale per measure, a thin square-ended bar per
 * condition, the value at the bar's tip.
 */
export function BarPanels({ title, legend, short, description, panels }: BarPanelsProps) {
    return (
        <ChartFrame title={title} legend={legend} description={description}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-hairline">
                {panels.map((panel) => (
                    <div key={panel.label} className="bg-paper-deep p-4">
                        <ChartRowLabel label={panel.label} meta={panel.meta} />
                        <div className="mt-5 flex flex-col gap-3">
                            {panel.bars.map((bar, index) => (
                                <div key={short[index]} className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-3">
                                    <span className={CHART_LABEL}>{short[index]}</span>
                                    {/* The right margin keeps room for the value at a long bar's tip. */}
                                    <div className="relative mr-16 h-3">
                                        {[0, 0.5, 1].map((tick) => (
                                            <span key={tick} className="absolute -inset-y-1.5 w-px bg-hairline" style={{ left: `${tick * 100}%` }} />
                                        ))}
                                        <span
                                            className={`absolute inset-y-0 left-0 ${CONDITION_FILL[index]}`}
                                            style={{ width: `${bar.at * 100}%` }}
                                        />
                                        {/* The hover target is taller than the 12px bar. */}
                                        <span
                                            title={`${legend[index]}: ${bar.label}`}
                                            className="absolute -inset-y-1.5 left-0 min-w-6"
                                            style={{ width: `${bar.at * 100}%` }}
                                        />
                                        <span
                                            className={`absolute top-1/2 ml-1 -translate-y-1/2 ${VALUE_LABEL} text-xs md:text-sm text-ink`}
                                            style={{ left: `${bar.at * 100}%` }}
                                        >
                                            {bar.label}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-3">
                                <span />
                                <div className="relative mr-16 h-4">
                                    <span className={`absolute left-0 top-0 ${CHART_TICK}`}>{panel.ticks[0]}</span>
                                    <span className={`absolute right-0 top-0 translate-x-1/2 ${CHART_TICK}`}>{panel.ticks[1]}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </ChartFrame>
    );
}

interface StatusSectionProps {
    heading: string;
    title: string;
    body: string;
    tags: string[];
    /** Matter under the status block, such as notes on privacy and intended use. */
    children?: React.ReactNode;
}

/** The closing block: build state stated plainly, with the stack tags. */
export function StatusSection({ heading, title, body, tags, children }: StatusSectionProps) {
    return (
        <section className="mx-auto max-w-280 px-6 py-16 md:py-24 border-t border-hairline">
            <SectionHeading>{heading}</SectionHeading>
            <div className="bg-paper-deep border border-hairline p-8 md:p-10">
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
                    {title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-ink/85 max-w-[62ch]">
                    {body}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                    ))}
                </div>
            </div>
            {children && <div className="mt-10">{children}</div>}
        </section>
    );
}
