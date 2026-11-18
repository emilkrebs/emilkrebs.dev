import Link from "next/link";
import { RouteLocaleSwitcher } from "./route-locale-switcher";
import { backHeaderCopy, type Locale } from "../lib/i18n";
import { routePath, type RouteKey } from "../lib/routes";

type BackHeaderWidth = "3xl" | "4xl" | "280" | "column";

interface BackHeaderProps {
    /** The page this header sits on; decides whether a language switcher shows. */
    route: RouteKey;
    /**
     * `column` is for pages whose document column (max-w-4xl) sits inside the
     * max-w-280 section grid, like the project record pages: the header repeats
     * both boxes, so its content edges land exactly on the column's edges.
     */
    maxWidth?: BackHeaderWidth;
    locale?: Locale;
}

const WIDTH_CLASSES: Record<"3xl" | "4xl" | "280", string> = {
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "280": "max-w-280",
};

export default function BackHeader({ route, maxWidth = "280", locale = "en" }: BackHeaderProps) {
    const t = backHeaderCopy[locale];
    const row = (
        <div className="flex h-16 items-center justify-between">
            <Link
                href={routePath("home", locale)}
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft hover:text-ink transition-colors duration-150"
            >
                <span className="text-signal" aria-hidden="true">←</span>
                {t.label}
            </Link>
            <RouteLocaleSwitcher route={route} locale={locale} />
        </div>
    );
    return (
        <nav
            aria-label={t.label}
            className="sticky top-0 z-50 w-full bg-paper border-b border-hairline"
        >
            {maxWidth === "column" ? (
                // The record page's two boxes, repeated: full-measure grid, then
                // the document column. The back link and the switcher sit on the
                // column's edges instead of one gutter inside them.
                <div className="mx-auto max-w-280 px-6">
                    <div className="mx-auto max-w-4xl">{row}</div>
                </div>
            ) : (
                <div className={`mx-auto px-4 md:px-6 ${WIDTH_CLASSES[maxWidth]}`}>{row}</div>
            )}
        </nav>
    );
}
