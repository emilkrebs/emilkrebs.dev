/** The row of signal squares that closes a block. `className` sets the display. */
export function TokenMark({ count = 12, className = "flex" }: { count?: number; className?: string }) {
    return (
        <div className={`${className} gap-2.5`} aria-hidden="true">
            {Array.from({ length: count }).map((_, i) => (
                <span key={i} className="size-1.5 bg-signal" />
            ))}
        </div>
    );
}
