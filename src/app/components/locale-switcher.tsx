"use client";

interface LocaleSwitcherProps {
    href: string;
    /** BCP 47 tag of the target page. */
    hrefLang: string;
    /** The locale the link switches to. */
    locale: "en" | "zh";
    /** Visible text, in the target locale. */
    label: string;
    /** Read by screen readers after the label, in the current page's locale. */
    aria: string;
    /** Hidden unless the locale script flagged the visitor as reading Chinese. */
    zhReadersOnly?: boolean;
}

/**
 * The language switcher, rendered on every page that exists in more than
 * one locale. A bordered tag in the nav grammar so it reads as an action,
 * not a nav link. Clicking it records the choice in localStorage, which the
 * locale redirect on `/` honors on later visits.
 */
export function LocaleSwitcher({ href, hrefLang, locale, label, aria, zhReadersOnly }: LocaleSwitcherProps) {
    return (
        <a
            href={href}
            hrefLang={hrefLang}
            onClick={() => {
                try {
                    localStorage.setItem("locale-pref", locale);
                } catch {
                    // storage blocked: the redirect falls back to the browser language
                }
            }}
            className={`${zhReadersOnly ? "hidden zh-reader:inline " : ""}border border-hairline px-2 py-1 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft hover:text-ink hover:border-ink transition-colors duration-150`}
        >
            {/* The visible label starts the accessible name, so voice control can target it by what it shows. */}
            <span lang={hrefLang}>{label}</span>
            <span className="sr-only"> {aria}</span>
        </a>
    );
}
