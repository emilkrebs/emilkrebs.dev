interface TagProps {
    children: React.ReactNode;
    /** Paper fill, for tags that sit on a paper-deep surface. */
    filled?: boolean;
    compact?: boolean;
    confidential?: boolean;
}

/** A mono label chip: technologies, formats, topics. */
export function Tag({ children, filled, compact, confidential }: TagProps) {
    const tone = confidential
        ? "border-ink/35 border-dashed bg-paper/70 text-ink"
        : `border-hairline text-ink-soft${filled ? " bg-paper" : ""}`;
    return (
        <span className={`border px-2 py-1 font-mono ${compact ? "text-[10px]" : "text-xs"} uppercase tracking-[0.08em] ${tone}`}>
            {children}
        </span>
    );
}

/** A tag with a signal square, for a project's state: preview, concept, live. */
export function StatusLabel({ children, confidential }: { children: React.ReactNode; confidential?: boolean }) {
    return (
        <span
            className={`inline-flex items-center gap-2 border px-2 py-1 font-mono text-xs uppercase tracking-[0.08em] whitespace-nowrap ${confidential
                ? "border-ink/40 border-dashed bg-paper text-ink"
                : "border-hairline"
            }`}
        >
            <span className="size-1.5 bg-signal" aria-hidden="true" />
            {children}
        </span>
    );
}
