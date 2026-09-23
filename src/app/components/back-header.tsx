import Link from "next/link";
import { LocaleSwitcher } from "./locale-switcher";
import { backHeaderCopy, type Locale, type LocaleSwitcherCopy } from "../lib/i18n";

type BackHeaderWidth = "3xl" | "4xl" | "280";

interface BackHeaderProps {
    maxWidth?: BackHeaderWidth;
    locale?: Locale;
    switcher?: LocaleSwitcherCopy;
}

const WIDTH_CLASSES: Record<BackHeaderWidth, string> = {
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "280": "max-w-280",
};

export default function BackHeader({ maxWidth = "280", locale = "en", switcher }: BackHeaderProps) {
    const t = backHeaderCopy[locale];
    return (
        <nav
            aria-label={t.label}
            className="sticky top-0 z-50 w-full bg-paper border-b border-hairline"
        >
            <div
                className={`mx-auto flex h-16 items-center justify-between px-4 md:px-6 ${WIDTH_CLASSES[maxWidth]}`}
            >
                <Link
                    href={t.href}
                    className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft hover:text-ink transition-colors duration-150"
                >
                    <span className="text-signal" aria-hidden="true">←</span>
                    {t.label}
                </Link>
                {switcher && (
                    <LocaleSwitcher
                        href={switcher.href}
                        label={switcher.label}
                        aria={switcher.aria}
                        pref={switcher.pref}
                    />
                )}
            </div>
        </nav>
    );
}
