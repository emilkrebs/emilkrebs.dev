import Link from "next/link";


export default function LinkButton(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
	return (
		<Link
			{...props}
			href={props.href ?? "#"}
			className={`${props.className} relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium transition-all duration-300 border-2 border-purple-400 rounded-full group hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
		>
			<span className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-600 via-purple-700 to-blue-700 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
			<span className="absolute top-0 left-0 w-full bg-gradient-to-b from-white to-transparent opacity-5 h-1/3"></span>
			<span className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent opacity-10"></span>
			<span className="relative text-white group-hover:text-purple-200 transition-colors duration-200">
				{props.children}
			</span>
		</Link>
	);
}