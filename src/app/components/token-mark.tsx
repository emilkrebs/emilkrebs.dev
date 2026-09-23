/** The row of signal squares that closes a block. `className` adds to the flex row, e.g. spacing or `max-md:hidden`. */
export function TokenMark({ count = 12, className = "" }: { count?: number; className?: string }) {
    return (
        <div className={`flex gap-2.5 ${className}`} aria-hidden="true">
            {Array.from({ length: count }).map((_, i) => (
                <span key={i} className="size-1.5 bg-signal" />
            ))}
        </div>
    );
}
