import Markdown from 'react-markdown';

interface MarkdownProps {
    content: string;
}

export default function RenderMarkdown(props: MarkdownProps) {
	return (
		<Markdown components={{
			h1: ({ node, ...props }) => <h1 className="text-2xl font-bold uppercase w-full" {...props} />,
			h2: ({ node, ...props }) => <h2 className="text-xl font-bold w-full mt-4 mb-2" {...props} />,
			h3: ({ node, ...props }) => <h3 className="text-lg font-bold w-full mt-4 mb-2" {...props} />,
			a: ({ node, ...props }) => <a className="hover:underline" {...props} />,
			p: ({ node, ...props }) => <p className="text-base w-full" {...props} />,
		}} >{props.content}</Markdown>
	);
}