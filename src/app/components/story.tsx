import type { MDXComponents } from "mdx/types";
import { Children, isValidElement } from "react";
import Image from "next/image";
import { ExternalNotice } from "./external-notice";
import { PlaceholderPlate } from "./placeholder-plate";
import { PreviewConsent } from "./preview-consent";
import { copy, storyCopy, type Locale } from "../lib/i18n";

interface EraProps {
    id: string;
    period: string;
    title: string;
    children: React.ReactNode;
}

function Era({ id, period, title, children }: EraProps) {
    return (
        <section id={id} className="relative mt-20 md:mt-24 pl-10 md:pl-14 first:mt-0">
            <span className="absolute left-0 top-1.5 size-2.5 bg-signal" aria-hidden="true" />
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">{period}</p>
            <h2 className="mt-3 text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.01em]">
                {title}
            </h2>
            <div className="mt-5 text-[1.0625rem] leading-[1.6] text-ink/85">{children}</div>
        </section>
    );
}

interface TimelineProps {
    children: React.ReactNode;
    locale?: Locale;
}

function Timeline({ children, locale = "en" }: TimelineProps) {
    const eras = Children.toArray(children).filter(
        (child): child is React.ReactElement<EraProps> =>
            isValidElement(child) && child.type === Era
    );

    return (
        <>
            <Contents
                locale={locale}
                items={eras.map((era) => ({
                    href: `#${era.props.id}`,
                    period: era.props.period,
                    title: era.props.title,
                }))}
            />
            <div className="relative mt-20 md:mt-24">
                {children}
                <span className="absolute left-[4px] top-0 bottom-0 w-px bg-hairline" aria-hidden="true" />
            </div>
        </>
    );
}

interface ContentsItem {
    href: string;
    period: string;
    title: string;
}

interface ContentsProps {
    items: ContentsItem[];
    locale?: Locale;
}

function Contents({ items, locale = "en" }: ContentsProps) {
    const t = storyCopy[locale];
    return (
        <nav aria-label={t.contents} className="mt-20 md:mt-24 border border-hairline">
            <div className="flex items-center justify-between gap-6 px-8 py-4 border-b border-hairline">
                <p className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">{t.contents}</p>
                <div className="hidden md:flex gap-2.5" aria-hidden="true">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <span key={i} className="size-1.5 bg-signal" />
                    ))}
                </div>
            </div>
            <ul>
                {items.map((item) => (
                    <li key={item.href} className="border-b border-hairline last:border-b-0">
                        <a
                            href={item.href}
                            className="group flex flex-col md:flex-row md:items-baseline justify-between gap-1 md:gap-6 px-8 py-5 hover:bg-paper-deep transition-colors duration-150"
                        >
                            <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft whitespace-nowrap">
                                {item.period}
                            </span>
                            <span className="text-base md:text-lg font-medium text-ink text-left md:text-right">
                                {item.title}
                                <span className="text-signal ml-2" aria-hidden="true">→</span>
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

interface ShowcaseProps {
    name: string;
    description: string;
    href?: string;
    internal?: boolean;
    notice?: boolean;
    confidential?: boolean;
    status?: string;
    tags?: string;
    image?: string;
    caption?: string;
    preview?: string;
    placeholder?: string;
    compact?: boolean;
    locale?: Locale;
}

function Showcase({
    name,
    description,
    href,
    internal,
    notice,
    confidential,
    status,
    tags,
    image,
    caption,
    preview,
    placeholder,
    compact,
    locale = "en",
}: ShowcaseProps) {
    const t = copy[locale];
    const external = href ? href.startsWith("http") && !internal : false;
    const tagsList = tags ? tags.split(",").map((tag) => tag.trim()) : [];
    const statusLower = status?.toLowerCase();
    const isConfidential =
        confidential ||
        statusLower === "confidential" ||
        tagsList.some((tag) => tag.toLowerCase() === "confidential") ||
        name.toLowerCase().includes("confidential");

    return (
        <article
            className={`relative overflow-hidden bg-paper-deep border flex flex-col group transition-colors duration-150 ${isConfidential
                ? "border-ink/35 border-dashed hover:border-ink/70"
                : "border-hairline hover:border-ink"
            }`}
        >
            {isConfidential && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-25"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, rgba(25, 25, 25, 0.35) 1px, transparent 0)",
                        backgroundSize: "16px 16px",
                    }}
                />
            )}
            {(preview || image || placeholder || isConfidential) && (
                <div className="relative">
                    <div
                        className={`relative border-b overflow-hidden ${isConfidential ? "border-dashed border-ink/30 bg-paper-deep" : "border-hairline bg-paper"
                        }`}
                        style={{ aspectRatio: compact ? "1 / 1" : "16 / 10" }}
                    >
                        {isConfidential ? (
                            <div className="absolute inset-0 grid place-items-center p-6">
                                <p className="mt-3 text-sm text-ink/85 text-center">
                                    {storyCopy[locale].confidentialNotice}
                                </p>
                            </div>
                        ) : preview ? (
                            <PreviewConsent
                                id={`story-preview-${name.toLowerCase().replace(/\s+/g, "-")}`}
                                src={preview}
                                title={`${name}${t.previewTitleSuffix}`}
                                placeholder={placeholder}
                                copy={t.consent}
                            />
                        ) : image ? (
                            <Image
                                src={image}
                                alt={`${name}${t.screenshotAltSuffix}`}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className={
                                    image.endsWith(".svg")
                                        ? "object-contain p-4 sm:p-6"
                                        : "object-cover object-top"
                                }
                            />
                        ) : (
                            <PlaceholderPlate label={name} />
                        )}
                    </div>
                    {!compact && caption && (
                        <p
                            className={`px-8 pt-3 font-mono text-xs uppercase tracking-[0.08em] ${isConfidential ? "text-ink-soft" : "text-ink/75"
                            }`}
                        >
                            {caption}
                        </p>
                    )}
                </div>
            )}
            <div className={`${compact ? "p-5 md:p-6" : "p-8 md:p-10"} flex flex-col flex-1`}>
                <div className="flex items-start justify-between gap-4">
                    <h3
                        className={`${compact ? "text-lg md:text-xl" : "text-2xl md:text-3xl"
                        } font-semibold tracking-tight`}
                    >
                        {name}
                    </h3>
                    {status && (
                        <span
                            className={`inline-flex items-center gap-2 border px-2 py-1 font-mono text-xs uppercase tracking-[0.08em] whitespace-nowrap ${isConfidential
                                ? "border-ink/40 border-dashed bg-paper text-ink"
                                : "border-hairline"
                            }`}
                        >
                            <span className="size-1.5 bg-signal" aria-hidden="true" />
                            {status}
                        </span>
                    )}
                </div>
                <p
                    className={`mt-3 ${compact ? "text-sm leading-relaxed" : "mt-4 text-base leading-relaxed"
                    } text-ink/85 flex-1 max-w-[62ch]`}
                >
                    {description}
                </p>
                {tagsList.length > 0 && (
                    <div className={`${compact ? "mt-4" : "mt-6"} flex flex-wrap gap-2`}>
                        {tagsList.map((tag) => (
                            <span
                                key={tag}
                                className={`border px-2 py-1 font-mono ${compact ? "text-[10px]" : "text-xs"
                                } uppercase tracking-[0.08em] ${isConfidential
                                    ? "border-ink/35 border-dashed bg-paper/70 text-ink"
                                    : "border-hairline bg-paper text-ink-soft"
                                }`}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
                <div className={compact ? "mt-5" : "mt-8"}>
                    {href ? (
                        notice ? (
                            <ExternalNotice href={href} title={name} copy={t.externalNotice} />
                        ) : (
                            <a
                                href={href}
                                target={external ? "_blank" : undefined}
                                rel={external ? "noopener noreferrer" : undefined}
                                className="inline-flex items-center gap-2 font-medium group-hover:text-signal transition-colors duration-150"
                            >
                                {t.open}
                                <span className="text-signal" aria-hidden="true">→</span>
                            </a>
                        )
                    ) : (
                        <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
                            {t.privateLabel}
                        </span>
                    )}
                </div>
            </div>
        </article>
    );
}

function ShowcaseGrid({ children, compact }: { children: React.ReactNode; compact?: boolean }) {
    return (
        <div
            className={`mt-10 grid grid-cols-1 ${compact ? "md:grid-cols-3 gap-4" : "md:grid-cols-2 gap-6"
            }`}
        >
            {children}
        </div>
    );
}

function TagRow({ label, items }: { label?: string; items: string }) {
    const tags = items.split(",").map((tag) => tag.trim());
    return (
        <div className="mt-6 flex flex-wrap items-center gap-2">
            {label && (
                <p className="mr-2 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">{label}</p>
            )}
            {tags.map((tag) => (
                <span
                    key={tag}
                    className="border border-hairline bg-paper px-2 py-1 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft"
                >
                    {tag}
                </span>
            ))}
        </div>
    );
}

function Lead({ children }: { children: React.ReactNode }) {
    return (
        <p className="mt-6 mb-10 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
            {children}
        </p>
    );
}

function TokenMark({ count = 12 }: { count?: number }) {
    return (
        <div className="flex gap-2.5" aria-hidden="true">
            {Array.from({ length: count }).map((_, i) => (
                <span key={i} className="size-1.5 bg-signal" />
            ))}
        </div>
    );
}

function PullQuote({ children }: { children: React.ReactNode }) {
    return (
        <blockquote className="mt-20 md:mt-24 border-l border-signal pl-6 md:pl-8 [&>p]:mb-0 [&>p]:max-w-[52ch] [&>p]:text-xl [&>p]:leading-relaxed md:[&>p]:text-2xl">
            {children}
        </blockquote>
    );
}

const shared = { Era, ShowcaseGrid, TagRow, Lead, TokenMark, PullQuote };

/**
 * The /story grammar per locale. English is the default set that
 * mdx-components.tsx provides to every MDX file; a localized story page
 * passes its set as the `components` prop, which MDX merges over it.
 */
export const storyComponents: Record<Locale, MDXComponents> = {
    en: { ...shared, Timeline, Contents, Showcase },
    zh: {
        ...shared,
        Timeline: (props: TimelineProps) => <Timeline {...props} locale="zh" />,
        Contents: (props: ContentsProps) => <Contents {...props} locale="zh" />,
        Showcase: (props: ShowcaseProps) => <Showcase {...props} locale="zh" />,
        // CJK has no true italic; the accent stays upright and contrasts by the serif face alone.
        em: ({ children }) => <em className="font-serif not-italic">{children}</em>,
    },
};
