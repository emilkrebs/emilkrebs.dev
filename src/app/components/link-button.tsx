
interface LinkButtonProps extends React.HTMLProps<HTMLAnchorElement>{
  
}

export default function LinkButton(props: LinkButtonProps) {
	return (
		<a
			{...props}
			className={`${props.className} border-white border-2 rounded-full px-4 py-2 transform transition-transform duration-200 hover:scale-105`}
		>
			{props.children}
		</a>
	);
}