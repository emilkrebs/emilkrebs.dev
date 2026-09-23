import "../globals.css";
import { Footer } from "./footer";
import { fontVariables } from "../lib/fonts";
import { copy, htmlLang, type Locale } from "../lib/i18n";
import { routePath } from "../lib/routes";

/**
 * Sends Chinese-language browsers from `/` to `/zh/` on entry, unless the
 * visitor picked English with the switcher. Navigation within the site (a
 * same-origin referrer) is never redirected: "Back to home" on an English
 * page stays English.
 */
const LOCALE_REDIRECT_SCRIPT = `(function () {
    try {
        if (location.pathname !== "/") return;
        if (document.referrer.indexOf(location.origin + "/") === 0) return;
        var pref = null;
        try { pref = localStorage.getItem("locale-pref"); } catch (e) {}
        if (pref === "en") return;
        var lang = (navigator.languages && navigator.languages[0]) || navigator.language || "";
        if (pref === "zh" || lang.toLowerCase().indexOf("zh") === 0) location.replace(${JSON.stringify(routePath("home", "zh"))});
    } catch (e) {}
})();`;

const ANALYTICS_SRC = "https://scripts.simpleanalyticscdn.com/latest.js";

/** The document shell shared by the per-locale root layouts. */
export function RootShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
    return (
        <html lang={htmlLang[locale]} className={fontVariables}>
            <head>
                {locale === "en" && <script>{LOCALE_REDIRECT_SCRIPT}</script>}
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
