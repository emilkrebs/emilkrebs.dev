import { EMAIL_ADDRESS, GITHUB_URL, LINKEDIN_URL } from "../lib/constants";
import { footerCopy, type Locale } from "../lib/i18n";

function TokenMark({ count = 12 }: { count?: number }) {
    return (
        <div className="flex gap-2.5" aria-hidden="true">
            {Array.from({ length: count }).map((_, i) => (
                <span key={i} className="size-1.5 bg-signal" />
            ))}
        </div>
    );
}

export function Footer({ locale = "en" }: { locale?: Locale }) {
    const t = footerCopy[locale];
    return (
        <footer className="w-full mt-auto">
            <div className="mx-auto w-full max-w-280 px-6 py-16 border-t border-hairline">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="font-mono text-xs uppercase tracking-[0.08em] text-ink-soft leading-loose">
                        <p>{t.location}</p>
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                        <a
                            href={GITHUB_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 hover:text-signal transition-colors duration-150 py-1"
                        >
                            GitHub <span className="text-signal" aria-hidden="true">→</span>
                        </a>
                        <a
                            href={LINKEDIN_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 hover:text-signal transition-colors duration-150 py-1"
                        >
                            LinkedIn <span className="text-signal" aria-hidden="true">→</span>
                        </a>
                        <a
                            href={`mailto:${EMAIL_ADDRESS}`}
                            className="inline-flex items-center gap-2 hover:text-signal transition-colors duration-150 py-1"
                        >
                            Email <span className="text-signal" aria-hidden="true">→</span>
                        </a>
                    </div>
                    <div className="flex gap-6 font-mono text-xs uppercase tracking-[0.08em] text-ink-soft">
                        <a href="/story" className="hover:text-ink transition-colors duration-150 py-1">
                            Story
                        </a>
                        <a href="/healthstack" className="hover:text-ink transition-colors duration-150 py-1">
                            Healthstack
                        </a>
                        <a href="/imprint" className="hover:text-ink transition-colors duration-150 py-1">
                            Imprint
                        </a>
                        <a href="/privacy" className="hover:text-ink transition-colors duration-150 py-1">
                            Privacy
                        </a>
                    </div>
                </div>
                <p className="mt-12 text-xs text-ink-soft">
                    © {new Date().getFullYear()} {t.copyright}
                </p>
                <div className="mt-10"><TokenMark /></div>
            </div>
        </footer>
    );
}
