import type { MetadataRoute } from "next";
import {
    ROUTES,
    absoluteUrl,
    languageAlternates,
    routeLocales,
    routePath,
    type RouteKey,
} from "./lib/routes";

export const dynamic = "force-static";

/**
 * Every indexable route in every locale, with absolute hreflang alternates.
 * No lastmod, priority, or changefreq: Google ignores the latter two, and a
 * lastmod stamped with the build time on every deploy teaches it to ignore
 * the first.
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const routes = (Object.keys(ROUTES) as RouteKey[]).filter((route) => ROUTES[route].index);
    return routes.flatMap((route) => {
        const languages = languageAlternates(route);
        return routeLocales(route).map((locale) => ({
            url: absoluteUrl(routePath(route, locale)),
            ...(languages && { alternates: { languages } }),
        }));
    });
}
