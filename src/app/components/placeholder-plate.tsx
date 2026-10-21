import { copy, type Locale } from "../lib/i18n";

interface PlaceholderPlateProps {
    label: string;
    locale?: Locale;
}

/**
 * The shared pending-screenshot plate, rendered inline wherever a product
 * screenshot is promised but not yet supplied: project cards and feature
 * sections. The frame never lies: it reads SCREENSHOT PENDING (截图待补 on
 * the Chinese pages) until a real image replaces it in the data. Colors are
 * tokens, so the plate follows both schemes without dark: variants.
 */
export function PlaceholderPlate({ label, locale = "en" }: PlaceholderPlateProps) {
    const t = copy[locale].placeholderPlate;
    const [before, after] = t.aria;
    return (
        <svg
            viewBox="0 0 1280 800"
            role="img"
            aria-label={`${before}${label}${after}`}
            className="block size-full text-hairline"
        >
            <rect
                x="24"
                y="24"
                width="1232"
                height="752"
                fill="none"
                stroke="currentColor"
            />
            <g className="fill-ink/10">
                <rect x="560" y="300" width="180" height="18" />
                <rect x="560" y="342" width="280" height="18" />
                <rect x="560" y="384" width="140" height="18" />
                <rect x="440" y="300" width="84" height="102" />
            </g>
            <rect x="560" y="452" width="14" height="14" className="fill-signal" />
            <text
                x="600"
                y="508"
                className="font-mono text-[26px] uppercase tracking-[8px] fill-ink-soft"
            >
                {t.pending}
            </text>
            <text
                x="600"
                y="560"
                className="font-mono text-[26px] uppercase tracking-[8px] fill-ink"
            >
                {label}
            </text>
        </svg>
    );
}
