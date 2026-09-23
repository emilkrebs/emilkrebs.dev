import type { MDXComponents } from "mdx/types";
import { Children, isValidElement } from "react";
import { ProjectCard } from "./project-card";
import { SmartLink } from "./smart-link";
import { Tag } from "./tag";
import { TokenMark } from "./token-mark";
import { storyCopy, type Locale } from "../lib/i18n";
import { STORY_CARD_SIZES, STORY_COMPACT_CARD_SIZES } from "../lib/image-sizes";
import { routePath, type RouteKey } from "../lib/routes";

interface EraProps {
    id: string;
    period: string;
    title: string;
    children: React.ReactNode;
}

function Era({ id, period, title, children }: EraProps) {
    return (
        // --era-gutter: the indent between the rail and the text; event markers reach back across it.
        <section
            id={id}
            className="relative mt-20 md:mt-24 [--era-gutter:2.5rem] md:[--era-gutter:3.5rem] pl-(--era-gutter) first:mt-0"
        >
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
                {/* Before the eras, so their markers paint over the rail. */}
                <span className="absolute left-[4px] top-0 bottom-0 w-px bg-hairline" aria-hidden="true" />
                {children}
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
                <TokenMark count={8} className="max-md:hidden" />
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
    /** External URL. */
    href?: string;
    /** Internal page, linked in the story's locale. */
    route?: RouteKey;
    notice?: boolean;
    confidential?: boolean;
    status?: string;
    /** Comma-separated. */
    tags?: string;
    image?: string;
    caption?: string;
    preview?: string;
    placeholder?: string;
    compact?: boolean;
    locale?: Locale;
}

/** ProjectCard as written in MDX: comma-separated tags, NDA work flagged by name, status, or tag. */
function Showcase({ tags, route, href, confidential, compact, locale = "en", ...card }: ShowcaseProps) {
    const tagList = tags ? tags.split(",").map((tag) => tag.trim()) : [];
    const isConfidential =
        confidential ||
        card.status?.toLowerCase() === "confidential" ||
        tagList.some((tag) => tag.toLowerCase() === "confidential") ||
        card.name.toLowerCase().includes("confidential");

    return (
        <ProjectCard
            {...card}
            tags={tagList}
            href={route ? routePath(route, locale) : href}
            confidential={isConfidential}
            variant={compact ? "compact" : undefined}
            sizes={compact ? STORY_COMPACT_CARD_SIZES : STORY_CARD_SIZES}
            filledTags
            locale={locale}
        />
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
                <Tag key={tag} filled>{tag}</Tag>
            ))}
        </div>
    );
}

interface EventRowProps {
    date: string;
    name: string;
    place: string;
    role?: string;
    href?: string;
}

function EventRow({ date, name, place, role, href }: EventRowProps) {
    return (
        <li className="relative flex items-baseline gap-x-4 text-sm leading-6">
            {/*
              * A minor stop on the timeline rail: hollow, smaller than the era mark.
              * Centered on the rail (4px + 0.5px) from an EventList placed directly in an Era.
              */}
            <span
                className="absolute top-2 left-[calc(1px_-_var(--era-gutter))] size-[7px] border border-ink-soft bg-paper"
                aria-hidden="true"
            />
            <span className="w-24 shrink-0 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
                {date}
            </span>
            <span className="flex flex-wrap items-baseline gap-x-4">
                {href ? (
                    <SmartLink href={href} className="text-ink hover:text-signal transition-colors duration-150">
                        {name}
                    </SmartLink>
                ) : (
                    <span className="text-ink">{name}</span>
                )}
                <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
                    {place}
                    {role && ` · ${role}`}
                </span>
            </span>
        </li>
    );
}

/** Waterkant Festival in Kiel, a yearly stop on the timeline. */
function Waterkant({ date, locale = "en" }: { date: string; locale?: Locale }) {
    const t = storyCopy[locale].waterkant;
    return <EventRow date={date} name="Waterkant Festival" place={t.place} role={t.role} href="https://waterkant.sh" />;
}

interface EventListProps {
    /** Accessible name; defaults to the locale's "Events". */
    label?: string;
    children: React.ReactNode;
    locale?: Locale;
}

function EventList({ label, children, locale = "en" }: EventListProps) {
    return (
        <ul aria-label={label ?? storyCopy[locale].events} className="my-8 space-y-1.5">
            {children}
        </ul>
    );
}

function Lead({ children }: { children: React.ReactNode }) {
    return (
        <p className="mt-6 mb-10 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
            {children}
        </p>
    );
}

function PullQuote({ children }: { children: React.ReactNode }) {
    return (
        <blockquote className="mt-20 md:mt-24 border-l border-signal pl-6 md:pl-8 [&>p]:mb-0 [&>p]:max-w-[52ch] [&>p]:text-xl [&>p]:leading-relaxed md:[&>p]:text-2xl">
            {children}
        </blockquote>
    );
}

const shared = { Era, ShowcaseGrid, TagRow, EventRow, Lead, TokenMark, PullQuote };

/**
 * The /story grammar per locale. English is the default set that
 * mdx-components.tsx provides to every MDX file; a localized story page
 * passes its set as the `components` prop, which MDX merges over it.
 */
export const storyComponents: Record<Locale, MDXComponents> = {
    en: { ...shared, Timeline, Contents, Showcase, EventList, Waterkant },
    zh: {
        ...shared,
        Timeline: (props: TimelineProps) => <Timeline {...props} locale="zh" />,
        Contents: (props: ContentsProps) => <Contents {...props} locale="zh" />,
        Showcase: (props: ShowcaseProps) => <Showcase {...props} locale="zh" />,
        EventList: (props: EventListProps) => <EventList {...props} locale="zh" />,
        Waterkant: (props: { date: string }) => <Waterkant {...props} locale="zh" />,
        // CJK has no true italic; the accent stays upright and contrasts by the serif face alone.
        em: ({ children }) => <em className="font-serif not-italic">{children}</em>,
    },
};
