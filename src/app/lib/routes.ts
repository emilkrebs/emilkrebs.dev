import { SITE_URL } from "./constants";
import { htmlLang, type Locale } from "./i18n";

interface Route {
    /**
     * Canonical path per published locale, trailing slash included. A route
     * launches in English, or in Chinese first with English to follow.
     */
    paths: { en: string; zh?: string } | { en?: undefined; zh: string };
    /** Whether search engines may index the route. */
    index: boolean;
}

/**
 * Every page of the site, and the single source for its URLs: canonical
 * tags, hreflang alternates, the sitemap, and internal links all derive
 * from this table, so they cannot drift apart.
 */
export const ROUTES = {
    home: { paths: { en: "/", zh: "/zh/" }, index: true },
    story: { paths: { en: "/story/", zh: "/zh/story/" }, index: true },
    healthstack: { paths: { en: "/healthstack/" }, index: true },
    "med-research-mcp": { paths: { zh: "/zh/med-research-mcp/" }, index: true },
    // Legal pages carry personal contact data and have no search value.
    imprint: { paths: { en: "/imprint/" }, index: false },
    privacy: { paths: { en: "/privacy/" }, index: false },
} satisfies Record<string, Route>;

export type RouteKey = keyof typeof ROUTES;

export function absoluteUrl(path: string): string {
    return `${SITE_URL}${path}`;
}

/** The locales a route is published in, English first. */
export function routeLocales(route: RouteKey): Locale[] {
    return Object.keys(ROUTES[route].paths) as Locale[];
}

/**
 * The route's path in `locale`, falling back to English where no translation
 * exists, or to Chinese for a route not yet published in English.
 */
export function routePath(route: RouteKey, locale: Locale = "en"): string {
    const paths: Route["paths"] = ROUTES[route].paths;
    if (paths.en === undefined) return paths[locale] ?? paths.zh;
    return paths[locale] ?? paths.en;
}

/**
 * Whether a page in `locale` may link to the route: it is published in that
 * locale, or in English, the fallback. English pages never send a reader to
 * a page that exists only in Chinese.
 */
export function routeAvailable(route: RouteKey, locale: Locale): boolean {
    const locales = routeLocales(route);
    return locales.includes(locale) || locales.includes("en");
}

/** Absolute hreflang alternates for a translated route; undefined for single-locale routes. */
export function languageAlternates(route: RouteKey): Record<string, string> | undefined {
    const locales = routeLocales(route);
    if (locales.length < 2) return undefined;
    return {
        ...Object.fromEntries(locales.map((locale) => [htmlLang[locale], absoluteUrl(routePath(route, locale))])),
        "x-default": absoluteUrl(routePath(route, "en")),
    };
}

/** Where the language switcher on a route points, if the route is translated. */
export function switchTarget(route: RouteKey, locale: Locale): { locale: Locale; href: string } | undefined {
    const target = routeLocales(route).find((candidate) => candidate !== locale);
    return target && { locale: target, href: routePath(route, target) };
}
