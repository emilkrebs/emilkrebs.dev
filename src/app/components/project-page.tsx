import Image from "next/image";
import { PlaceholderPlate } from "./placeholder-plate";
import { Tag } from "./tag";
import type { Locale } from "../lib/i18n";
import { FULL_WIDTH_SIZES } from "../lib/image-sizes";

/**
 * The grammar the project pages share (/healthstack, /med-research-mcp):
 * mono section headings, feature sections with a spec-style stat table,
 * prose and row sections, screenshot plates, spec and data tables, and the
 * closing status block.
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
