import Link from "next/link";
import Markdown from "react-markdown";

interface MarkdownProps {
  content: string;
}

export default function RenderMarkdown(props: MarkdownProps) {
    return (
        <div className="max-w-none">
            <Markdown
                components={{
                    h1: ({ node, ...props }) => (
                        <h1
                            className="text-3xl font-bold mb-8 mt-6 tracking-tight"
                            {...props}
                        />
                    ),
                    h2: ({ node, ...props }) => (
                        <h2
                            className="text-2xl font-semibold mb-3 mt-10 tracking-tight"
                            {...props}
                        />
                    ),
                    h3: ({ node, ...props }) => (
                        <h3
                            className="text-xl font-semibold mb-3 mt-8 tracking-tight"
                            {...props}
                        />
                    ),
                    a: ({ node, ...props }) => {
                        const href = props.href || "";
                        const external = href.startsWith("http");
                        return (
                            <Link
                                passHref
                                className="text-ink underline underline-offset-4 decoration-signal hover:text-signal transition-colors duration-150"
                                href={href}
                                {...props}
                                target={external ? "_blank" : undefined}
                                rel={external ? "noopener noreferrer" : undefined}
                            />
                        );
                    },
                    p: ({ node, ...props }) => (
                        <p className="mb-4 leading-relaxed" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                        <ul
                            className="pl-6 mb-4 list-disc space-y-1"
                            {...props}
                        />
                    ),
                    ol: ({ node, ...props }) => (
                        <ol
                            className="pl-6 mb-4 list-decimal space-y-1"
                            {...props}
                        />
                    ),
                    li: ({ node, ...props }) => (
                        <li className="leading-relaxed" {...props} />
                    ),
                    hr: ({ node, ...props }) => (
                        <hr {...props} className="my-6 border-hairline" />
                    ),
                    sup: ({ node, ...props }) => (
                        <sup {...props} className="font-bold px-1 text-signal" />
                    ),
                    strong: ({ node, ...props }) => (
                        <strong {...props} className="font-bold" />
                    ),
                    em: ({ node, ...props }) => (
                        <em {...props} className="font-serif italic" />
                    ),
                    code: ({ node, ...props }) => (
                        <code
                            {...props}
                            className="bg-paper-deep font-mono text-sm px-1.5 py-0.5"
                        />
                    ),
                }}
            >
                {props.content}
            </Markdown>
        </div>
    );
}
