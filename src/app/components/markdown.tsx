import Link from "next/link";
import Markdown from "react-markdown";

interface MarkdownProps {
    content: string;
}

export default function RenderMarkdown(props: MarkdownProps) {
	return (
		<Markdown components={{
			h1: ({ node, ...props }) => <h1 className="w-full text-2xl font-bold uppercase" {...props} />,
			h2: ({ node, ...props }) => <h2 className="w-full mt-4 mb-2 text-xl font-bold" {...props} />,
			h3: ({ node, ...props }) => <h3 className="w-full mt-4 mb-2 text-lg font-bold" {...props} />,
			a: ({ node, ...props }) => <Link className="text-blue-500 hover:underline" {...props} href={props.href ?? "#"} />,
			p: ({ node, ...props }) => <p className="w-full text-base" {...props} />,
		}} >{props.content}</Markdown>
	);
}