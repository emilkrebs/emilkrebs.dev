import Markdown from "react-markdown";
import { SmartLink } from "./smart-link";

interface MarkdownProps {
  content: string;
}

// Each renderer picks only the props it needs: react-markdown also passes its
// hast `node`, which must not be spread onto DOM elements.
export default function RenderMarkdown(props: MarkdownProps) {
    return (
        <div className="max-w-none">
            <Markdown
                components={{
                    h1: ({ children }) => (
                        <h1 className="text-3xl font-bold mb-8 mt-6 tracking-tight">{children}</h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-2xl font-semibold mb-3 mt-10 tracking-tight">{children}</h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-xl font-semibold mb-3 mt-8 tracking-tight">{children}</h3>
                    ),
                    a: ({ children, href }) => (
                        <SmartLink
                            href={href ?? ""}
                            className="text-ink hover:text-signal transition-colors duration-150"
                        >
                            {children}
                        </SmartLink>
                    ),
                    p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="pl-6 mb-4 list-disc space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="pl-6 mb-4 list-decimal space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                    hr: () => <hr className="my-6 border-hairline" />,
                    sup: ({ children }) => <sup className="font-bold px-1 text-signal">{children}</sup>,
                    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                    em: ({ children }) => <em className="font-serif italic">{children}</em>,
                    code: ({ children }) => (
                        <code className="bg-paper-deep font-mono text-sm px-1.5 py-0.5">{children}</code>
                    ),
                }}
            >
                {props.content}
            </Markdown>
        </div>
    );
}
