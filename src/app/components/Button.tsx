interface ButtonProps extends React.AnchorHTMLAttributes<HTMLButtonElement> {
	variants?: 'primary' | 'secondary' | 'danger';
	size?: 'small' | 'medium' | 'large';
}


export default function Button(props: ButtonProps) {
	const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900';
	const variantClasses = {
		primary: 'bg-purple-600 text-white hover:bg-purple-700',
		secondary: 'bg-blue-600 text-white hover:bg-blue-700',
		danger: 'bg-red-600 text-white hover:bg-red-700'
	};
	const sizeClasses = {
		small: 'px-4 py-2 text-sm',
		medium: 'px-6 py-3',
		large: 'px-8 py-4 text-lg'
	};

	const variant = props.variants || 'primary';
	const size = props.size || 'medium';

	return (
		<button
			className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${props.className ?? ''}`}
			onClick={props.onClick}
		>
			{props.children}
		</button>
	);
}
