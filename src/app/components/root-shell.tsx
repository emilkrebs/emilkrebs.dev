import "../globals.css";
import { Footer } from "./footer";
import { fontVariables } from "../lib/fonts";
import { copy, htmlLang, type Locale } from "../lib/i18n";
import { routePath } from "../lib/routes";

/**
 * Runs before first paint on English pages. It does two things, based only
 * on the browser's current primary language — nothing is stored, so a fresh
 * visit always reflects whatever the browser reports right now:
 *
 * - Flags visitors whose primary browser language is Chinese with
 *   `data-zh-reader` on <html>, which reveals the switcher to the Chinese
 *   version via the `zh-reader:` variant. Everyone else never sees it: a
 *   secondary accepted language (many English-primary browsers list others)
 *   does not count, only the language the browser puts first.
 * - Sends those same visitors from `/` to `/zh/` on entry. Navigation within
 *   the site (a same-origin referrer) is never redirected: "Back to home"
 *   on an English page stays English. Query and hash carry over, so
 *   campaign parameters and anchors survive the redirect.
 *
 * There is no memory of a past choice: a visitor whose browser still
 * reports Chinese first is redirected again on their next fresh visit even
 * after picking English once. The switcher on the English page is how they
 * get back to Chinese, not a stored preference.
 */
const LOCALE_SCRIPT = `(function () {
    try {
        var langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
        var primaryIsZh = String(langs[0] || "").toLowerCase().indexOf("zh") === 0;
        if (primaryIsZh) {
            document.documentElement.setAttribute("data-zh-reader", "");
        }
        if (location.pathname !== "/") return;
        if (document.referrer.indexOf(location.origin + "/") === 0) return;
        if (primaryIsZh) location.replace(${JSON.stringify(routePath("home", "zh"))} + location.search + location.hash);
    } catch (e) {}
})();`;

const ANALYTICS_SRC = "https://scripts.simpleanalyticscdn.com/latest.js";

/** The document shell shared by the per-locale root layouts. */
export function RootShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
    return (
        // suppressHydrationWarning: the locale script adds data-zh-reader to <html> before React hydrates.
        // data-scroll-behavior: lets Next.js suspend globals.css's smooth scrolling during route changes.
        <html
            lang={htmlLang[locale]}
            className={fontVariables}
            data-scroll-behavior="smooth"
            suppressHydrationWarning
        >
            <head>
                {locale === "en" && <script>{LOCALE_SCRIPT}</script>}
            </head>
            <body className="overflow-x-hidden min-h-screen flex flex-col">
                <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:bg-ink focus:text-paper focus:px-4 focus:py-2 font-mono text-xs uppercase tracking-[0.08em]"
                >
                    {copy[locale].skipLink}
                </a>
                <script async defer src={ANALYTICS_SRC}></script>
                {children}
                <Footer locale={locale} />
            </body>
        </html>
    );
}
