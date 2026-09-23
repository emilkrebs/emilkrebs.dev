import Image from "next/image";
import { ExternalNotice } from "./external-notice";
import { PlaceholderPlate } from "./placeholder-plate";
import { PreviewConsent } from "./preview-consent";
import { SmartLink } from "./smart-link";
import { StatusLabel, Tag } from "./tag";
import { copy, storyCopy, type Locale } from "../lib/i18n";

export interface ProjectCardProps {
    name: string;
    description: string;
    locale: Locale;
    tags: string[];
    /** Internal path or external URL. Without one the card reads "Private". */
    href?: string;
    /** Gate the link behind the testing notice. */
    notice?: boolean;
    status?: string;
    image?: string;
    /** A third-party live preview, always loaded behind the consent gate. */
    preview?: string;
    /** Blurred backdrop behind the consent gate. */
    placeholder?: string;
    caption?: string;
    /** NDA work: dashed frame, no media, no details. */
    confidential?: boolean;
    /** flagship: larger title. compact: square media, tighter type, no caption. */
    variant?: "flagship" | "compact";
    /** Paper-filled tags, as on the story page. */
    filledTags?: boolean;
    /** The media's rendered width, for srcset selection. */
    sizes?: string;
}

/** The project card shared by the landing page and the story. */
export function ProjectCard({
    name,
    description,
    locale,
    tags,
    href,
    notice,
    status,
    image,
    preview,
    placeholder,
    caption,
    confidential,
    variant,
    filledTags,
    sizes = "100vw",
}: ProjectCardProps) {
    const t = copy[locale];
    const compact = variant === "compact";
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    return (
        <article
            className={`relative overflow-hidden bg-paper-deep border flex flex-col group transition-colors duration-150 ${confidential
                ? "border-ink/35 border-dashed hover:border-ink/70"
                : "border-hairline hover:border-ink"
            }`}
        >
            {confidential && (
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
            {(preview || image || placeholder || confidential) && (
                <div className="relative">
                    <div
                        className={`relative border-b overflow-hidden ${compact ? "aspect-square" : "aspect-16/10"} ${confidential
                            ? "border-dashed border-ink/30 bg-paper-deep"
                            : "border-hairline bg-paper"
                        }`}
                    >
                        {confidential ? (
                            <div className="absolute inset-0 grid place-items-center p-6">
                                <p className="mt-3 text-sm text-ink/85 text-center">
                                    {storyCopy[locale].confidentialNotice}
                                </p>
                            </div>
                        ) : preview ? (
                            <PreviewConsent
                                id={`consent-${slug}`}
                                src={preview}
                                title={`${name}${t.previewTitleSuffix}`}
                                placeholder={placeholder}
                                copy={t.consent}
                                sizes={sizes}
                            />
                        ) : image ? (
                            <Image
                                src={image}
                                alt={`${name}${t.screenshotAltSuffix}`}
                                fill
                                sizes={sizes}
                                unoptimized={image.endsWith(".svg")}
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
                            className={`px-8 pt-3 font-mono text-xs uppercase tracking-[0.08em] ${confidential ? "text-ink-soft" : "text-ink/75"}`}
                        >
                            {caption}
                        </p>
                    )}
                </div>
            )}
            <div className={`${compact ? "p-5 md:p-6" : "p-8 md:p-10"} flex flex-col flex-1`}>
                <div className="flex items-start justify-between gap-4">
                    <h3
                        className={`${variant === "flagship"
                            ? "text-3xl md:text-4xl"
                            : compact
                                ? "text-lg md:text-xl"
                                : "text-2xl md:text-3xl"
                        } font-semibold tracking-tight`}
                    >
                        {name}
                    </h3>
                    {status && <StatusLabel confidential={confidential}>{status}</StatusLabel>}
                </div>
                <p
                    className={`${compact ? "mt-3 text-sm" : "mt-4 text-base"} leading-relaxed text-ink/85 flex-1 max-w-[62ch]`}
                >
                    {description}
                </p>
                {tags.length > 0 && (
                    <div className={`${compact ? "mt-4" : "mt-6"} flex flex-wrap gap-2`}>
                        {tags.map((tag) => (
                            <Tag key={tag} filled={filledTags} compact={compact} confidential={confidential}>
                                {tag}
                            </Tag>
                        ))}
                    </div>
                )}
                <div className={compact ? "mt-5" : "mt-8"}>
                    {href ? (
                        notice ? (
                            <ExternalNotice href={href} title={name} copy={t.externalNotice} />
                        ) : (
                            <SmartLink
                                href={href}
                                className="inline-flex items-center gap-2 font-medium group-hover:text-signal transition-colors duration-150"
                            >
                                {t.open}
                                <span className="text-signal" aria-hidden="true">→</span>
                            </SmartLink>
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
