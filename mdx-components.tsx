import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import Image from "next/image";
import { ExternalNotice } from "./src/app/components/external-notice";
import { PlaceholderPlate } from "./src/app/components/placeholder-plate";
import { PreviewConsent } from "./src/app/components/preview-consent";

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

function Timeline({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative mt-20 md:mt-24">
            {children}
            <span className="absolute left-[4px] top-0 bottom-0 w-px bg-hairline" aria-hidden="true" />
        </div>
    );
}

interface ContentsItem {
    href: string;
    period: string;
    title: string;
}

function Contents({ items }: { items: ContentsItem[] }) {
    return (
        <nav aria-label="Contents" className="mt-20 md:mt-24 border border-hairline">
            <div className="flex items-center justify-between gap-6 px-8 py-4 border-b border-hairline">
                <p className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">Contents</p>
                <div className="hidden md:flex gap-2.5" aria-hidden="true">
                    {Array.from({ length: 7 }).map((_, i) => (
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
    status?: string;
    tags?: string;
    image?: string;
    caption?: string;
    preview?: string;
    placeholder?: string;
    compact?: boolean;
}

function Showcase({
    name,
    description,
    href,
    internal,
    notice,
    status,
    tags,
    image,
    caption,
    preview,
    placeholder,
    compact,
}: ShowcaseProps) {
    const external = href ? href.startsWith("http") && !internal : false;
    const tagsList = tags ? tags.split(",").map((tag) => tag.trim()) : [];

    return (
        <article className="bg-paper-deep border border-hairline flex flex-col group hover:border-ink transition-colors duration-150">
            {(preview || image || placeholder) && (
                <div className="relative">
                    <div
                        className={`relative ${
                            compact ? "aspect-square" : "aspect-16/10"
                        } border-b border-hairline overflow-hidden bg-paper`}
                    >
                        {preview ? (
                            <PreviewConsent
                                id={`story-preview-${name.toLowerCase().replace(/\s+/g, "-")}`}
                                src={preview}
                                title={`${name} preview`}
                                placeholder={placeholder}
                            />
                        ) : image ? (
                            <Image
                                src={image}
                                alt={`${name} screenshot`}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className={
                                    image.endsWith(".svg")
                                        ? "object-contain"
                                        : "object-cover object-top"
                                }
                            />
                        ) : (
                            <PlaceholderPlate label={name} />
                        )}
                    </div>
                    {!compact && caption && (
                        <p className="px-8 pt-3 font-mono text-xs uppercase tracking-[0.08em] text-ink/75">
                            {caption}
                        </p>
                    )}
                </div>
            )}
            <div className={`${compact ? "p-5 md:p-6" : "p-8 md:p-10"} flex flex-col flex-1`}>
                <div className="flex items-start justify-between gap-4">
                    <h3
                        className={`${
                            compact ? "text-lg md:text-xl" : "text-2xl md:text-3xl"
                        } font-semibold tracking-tight`}
                    >
                        {name}
                    </h3>
                    {status && (
                        <span className="inline-flex items-center gap-2 border border-hairline px-2 py-1 font-mono text-xs uppercase tracking-[0.08em] whitespace-nowrap">
                            <span className="size-1.5 bg-signal" aria-hidden="true" />
                            {status}
                        </span>
                    )}
                </div>
                <p
                    className={`mt-3 ${
                        compact ? "text-sm leading-relaxed" : "mt-4 text-base leading-relaxed"
                    } text-ink/85 flex-1 max-w-[62ch]`}
                >
                    {description}
                </p>
                {tagsList.length > 0 && (
                    <div className={`${compact ? "mt-4" : "mt-6"} flex flex-wrap gap-2`}>
                        {tagsList.map((tag) => (
                            <span
                                key={tag}
                                className={`border border-hairline bg-paper px-2 py-1 font-mono ${
                                    compact ? "text-[10px]" : "text-xs"
                                } uppercase tracking-[0.08em] text-ink-soft`}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
                <div className={compact ? "mt-5" : "mt-8"}>
                    {href ? (
                        notice ? (
                            <ExternalNotice href={href} title={name} />
                        ) : (
                            <a
                                href={href}
                                target={external ? "_blank" : undefined}
                                rel={external ? "noopener noreferrer" : undefined}
                                className="inline-flex items-center gap-2 font-medium group-hover:text-signal transition-colors duration-150"
                            >
                                Open
                                <span className="text-signal" aria-hidden="true">→</span>
                            </a>
                        )
                    ) : (
                        <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
                            Private
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
            className={`mt-10 grid grid-cols-1 ${
                compact ? "md:grid-cols-3 gap-4" : "md:grid-cols-2 gap-6"
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

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        ...components,
        h1: ({ children }) => (
            <h1 className="font-bold tracking-[-0.03em] leading-[0.98] text-[clamp(2.5rem,6vw,4.5rem)]">
                {children}
            </h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.01em] mb-4 mt-10">
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-xl font-semibold mb-3 mt-8 tracking-tight">{children}</h3>
        ),
        p: ({ children }) => <p className="mb-4 leading-[1.6]">{children}</p>,
        em: ({ children }) => <em className="font-serif italic">{children}</em>,
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        a: ({ children, href }) => {
            const external = (href ?? "").startsWith("http");
            return (
                <Link
                    className="text-ink underline underline-offset-4 decoration-signal hover:text-signal transition-colors duration-150"
                    href={href ?? ""}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                >
                    {children}
                </Link>
            );
        },
        ul: ({ children }) => <ul className="pl-6 mb-4 list-disc space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="pl-6 mb-4 list-decimal space-y-1">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        hr: () => <hr className="my-6 border-hairline" />,
        blockquote: ({ children }) => (
            <blockquote className="border-l border-hairline pl-6 mb-4 text-ink-soft">
                {children}
            </blockquote>
        ),
        code: ({ children }) => (
            <code className="bg-paper-deep font-mono text-sm px-1.5 py-0.5">{children}</code>
        ),
        Era,
        Timeline,
        Contents,
        Showcase,
        ShowcaseGrid,
        TagRow,
        Lead,
        TokenMark,
        PullQuote,
    };
}
