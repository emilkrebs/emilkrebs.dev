import Link from "next/link";

interface SmartLinkProps {
    href: string;
    className?: string;
    children: React.ReactNode;
}

/**
 * The site's link rule in one place: internal page paths use next/link;
 * everything else (external URLs, mailto:, #anchors) is a plain anchor,
 * with external URLs opening in a new tab.
 */
export function SmartLink({ href, className, children }: SmartLinkProps) {
    if (href.startsWith("/")) {
        return <Link href={href} className={className}>{children}</Link>;
    }
    const external = href.startsWith("http");
    return (
        <a
            href={href}
            className={className}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
        >
            {children}
        </a>
    );
}
