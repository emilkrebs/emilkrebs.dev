import Image from "next/image";
import { PlaceholderPlate } from "./placeholder-plate";
import { Tag } from "./tag";
import type { Locale } from "../lib/i18n";
import { FULL_WIDTH_SIZES } from "../lib/image-sizes";

/**
 * The grammar the project pages share (/healthstack, /zh/med-research-mcp):
 * mono section headings, feature sections with a spec-style stat table,
 * screenshot plates, spec tables, and the closing status block.
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

export function StatTable({ stats }: { stats: Stat[] }) {
    const fill = (6 - (stats.length % 6)) % 6;
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-hairline border border-hairline">
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
                    className="bg-paper-deep p-4"
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
    locale?: Locale;
    /** Full-width matter under the text and stats: a screenshot plate, a spec table. */
    children?: React.ReactNode;
}

/** One capability: mono heading, headline, proof sentence, and stat table, with optional matter below. */
export function FeatureSection({ heading, title, proof, stats, locale = "en", children }: FeatureSectionProps) {
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
                    <StatTable stats={stats} />
                </div>
            </div>
            {children && <div className="mt-8">{children}</div>}
        </section>
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
