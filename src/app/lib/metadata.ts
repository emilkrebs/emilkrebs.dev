import type { Metadata, Viewport } from "next";
import { SITE_NAME, SITE_URL } from "./constants";
import { copy, ogLocale, type Locale } from "./i18n";
import {
    ROUTES,
    absoluteUrl,
    languageAlternates,
    routeLocales,
    routePath,
    type RouteKey,
} from "./routes";

export interface OgImage {
    url: string;
    width: number;
    height: number;
    alt: string;
}

// JPEG, not WebP: link unfurlers (LinkedIn above all) do not reliably render WebP.
const DEFAULT_OG_IMAGE = { url: "/og/default.jpg", width: 1200, height: 630 };

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#f7f5f0" },
        { media: "(prefers-color-scheme: dark)", color: "#141310" },
    ],
    colorScheme: "light dark",
    initialScale: 1,
    width: "device-width",
};

/** Site-wide defaults for a root layout; every page adds its own via pageMetadata. */
export function siteMetadata(locale: Locale): Metadata {
    const t = copy[locale].meta;
    return {
        metadataBase: new URL(SITE_URL),
        title: {
            default: t.title,
            template: `%s | ${SITE_NAME}`,
        },
        description: t.description,
        keywords: t.keywords,
        authors: [{ name: SITE_NAME, url: SITE_URL }],
        creator: SITE_NAME,
        publisher: SITE_NAME,
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
        icons: {
            icon: "/favicon.svg",
            apple: "/apple-touch-icon.png",
        },
    };
}

interface PageMetadataOptions {
    route: RouteKey;
    locale?: Locale;
    /** Omit on home pages, where the layout's default title applies. */
    title?: string;
    description: string;
    image?: OgImage;
}

/**
 * The complete per-page metadata. Next.js replaces rather than merges a
 * parent's openGraph and twitter objects, so every page sets canonical,
 * hreflang, Open Graph, and Twitter together through this one function.
 */
export function pageMetadata({ route, locale = "en", title, description, image }: PageMetadataOptions): Metadata {
    const url = absoluteUrl(routePath(route, locale));
    const fullTitle = title ? `${title} | ${SITE_NAME}` : copy[locale].meta.title;
    const ogImage = image ?? { ...DEFAULT_OG_IMAGE, alt: copy[locale].meta.title };
    return {
        ...(title && { title }),
        description,
        alternates: {
            canonical: url,
            languages: languageAlternates(route),
        },
        openGraph: {
            type: "website",
            locale: ogLocale[locale],
            alternateLocale: routeLocales(route)
                .filter((other) => other !== locale)
                .map((other) => ogLocale[other]),
            url,
            siteName: SITE_NAME,
            title: fullTitle,
            description,
            images: [ogImage],
        },
        twitter: {
            card: "summary_large_image",
            title: fullTitle,
            description,
            images: [ogImage.url],
        },
        ...(!ROUTES[route].index && { robots: { index: false, follow: true } }),
    };
}
