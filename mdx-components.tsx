import type { MDXComponents } from "mdx/types";
import { SmartLink } from "./src/app/components/smart-link";
import { storyComponents } from "./src/app/components/story";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        ...components,
        h1: ({ children }) => (
            <h1 className="font-bold tracking-[-0.03em] leading-[0.98] text-[clamp(2.5rem,6vw,4.5rem)]">
                {children}
            </h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.01em] mb-4 mt-10">
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-xl font-semibold mb-3 mt-8 tracking-tight">{children}</h3>
        ),
        p: ({ children }) => <p className="mb-4 leading-[1.6]">{children}</p>,
        em: ({ children }) => <em className="font-serif italic">{children}</em>,
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        a: ({ children, href }) => (
            <SmartLink className="text-ink hover:text-signal transition-colors duration-150" href={href ?? ""}>
                {children}
            </SmartLink>
        ),
        ul: ({ children }) => <ul className="pl-6 mb-4 list-disc space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="pl-6 mb-4 list-decimal space-y-1">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        hr: () => <hr className="my-6 border-hairline" />,
        blockquote: ({ children }) => (
            <blockquote className="border-l border-hairline pl-6 mb-4 text-ink-soft">
                {children}
            </blockquote>
        ),
        code: ({ children }) => (
            <code className="bg-paper-deep font-mono text-sm px-1.5 py-0.5">{children}</code>
        ),
        ...storyComponents.en,
    };
}
