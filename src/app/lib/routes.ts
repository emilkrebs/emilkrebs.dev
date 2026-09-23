import { SITE_URL } from "./constants";
import { htmlLang, type Locale } from "./i18n";

interface Route {
    /** Canonical path per published locale, trailing slash included. */
    paths: { en: string } & Partial<Record<Locale, string>>;
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

/** The route's path in `locale`, falling back to English where no translation exists. */
export function routePath(route: RouteKey, locale: Locale = "en"): string {
    const paths: Route["paths"] = ROUTES[route].paths;
    return paths[locale] ?? paths.en;
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
