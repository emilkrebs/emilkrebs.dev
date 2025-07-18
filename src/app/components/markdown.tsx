import Link from 'next/link';
import Markdown from 'react-markdown';

interface MarkdownProps {
	content: string;
}

export default function RenderMarkdown(props: MarkdownProps) {
	return (
		<Markdown components={{
			h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-white mb-4 mt-6" {...props} />,
			h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-purple-200 mb-3 mt-5" {...props} />,
			h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-purple-300 mb-3 mt-4" {...props} />,
			a: ({ node, ...props }) => <Link target="_blank" passHref className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200" href={props.href || ''} {...props} />,
			p: ({ node, ...props }) => <p className="mb-4 text-gray-200 leading-relaxed" {...props} />,
			ul: ({ node, ...props }) => <ul className="pl-6 mb-4 list-disc text-gray-200 space-y-1" {...props} />,
			ol: ({ node, ...props }) => <ol className="pl-6 mb-4 list-decimal text-gray-200 space-y-1" {...props} />,
			li: ({ node, ...props }) => <li className="text-gray-200 leading-relaxed" {...props} />,
			hr: ({ node, ...props }) => <hr {...props} className="my-6 border-purple-500/30" />,
			sup: ({ node, ...props }) => <sup {...props} className="font-bold px-1 text-purple-300" />,
			strong: ({ node, ...props }) => <strong {...props} className="font-bold text-white" />,
			em: ({ node, ...props }) => <em {...props} className="italic text-purple-200" />,
			code: ({ node, ...props }) => <code {...props} className="bg-purple-900/50 text-purple-200 px-2 py-1 rounded text-sm" />,
		}} >{props.content}</Markdown>
	);
}