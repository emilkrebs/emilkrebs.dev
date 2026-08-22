"use client";

interface LocaleSwitcherProps {
    href: string;
    label: string;
    aria: string;
    pref: "en" | "zh";
}

/**
 * The language switcher. Rendered only on the localized pages (currently
 * /zh/), not on the English default. A bordered tag in the nav grammar so it
 * reads as an action, not a nav link. Clicking it records the manual
 * preference in localStorage so the zh-detection redirect on `/` does not
 * bounce the user back after they switched to English on purpose.
 */
export function LocaleSwitcher({ href, label, aria, pref }: LocaleSwitcherProps) {
    return (
        <a
            href={href}
            aria-label={aria}
            onClick={() => {
                try {
                    localStorage.setItem("locale-pref", pref);
                } catch {
                    // storage blocked: the redirect script simply keeps running
                }
            }}
            className="border border-hairline px-2 py-1 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft hover:text-ink hover:border-ink transition-colors duration-150"
        >
            {label}
        </a>
    );
}
