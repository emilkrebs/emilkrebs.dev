import Link from "next/link";


export default function LinkButton(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
	return (
		<Link
			{...props}
			href={props.href ?? "#"}
			className={`${props.className} border-white border-2 rounded-full px-4 py-2 transform transition-transform duration-200 hover:scale-105`}
		>
			{props.children}
		</Link>
	);
}