import { LocaleSwitcher } from "./locale-switcher";
import { copy, htmlLang, type Locale } from "../lib/i18n";
import { switchTarget, type RouteKey } from "../lib/routes";

/**
 * The language switcher for a route, or nothing when the route is not
 * translated. The switch to Chinese shows only to visitors who read Chinese;
 * the switch back to English shows to everyone.
 */
export function RouteLocaleSwitcher({ route, locale }: { route: RouteKey; locale: Locale }) {
    const target = switchTarget(route, locale);
    if (!target) return null;
    const t = copy[locale].switcher;
    return (
        <LocaleSwitcher
            href={target.href}
            hrefLang={htmlLang[target.locale]}
            locale={target.locale}
            label={t.label}
            aria={t.aria}
            zhReadersOnly={target.locale === "zh"}
        />
    );
}
