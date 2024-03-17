import './globals.css';
import Footer from './components/footer';
import Navbar from './components/navbar';
import { Metadata } from 'next';
import { Components } from 'react-markdown';

export const metadata: Metadata = {
	title: 'Emil Krebs',
	description: 'Emil Krebs Website',
};

export const markdownComponents: Partial<Components> = {
	h1: ({node, ...props}) => <h1 className="text-2xl font-bold uppercase w-full" {...props} />,
	h2: ({node, ...props}) => <h2 className="text-xl font-bold w-full mt-4 mb-2" {...props} />,
	a: ({node, ...props}) => <a className="hover:underline" {...props} />,
	p: ({node, ...props}) => <p className="text-base w-full" {...props} />,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />

				<title>Emil Krebs</title>
			</head>

			<body className='font-sans'>
				<Navbar />
				{children}
				<Footer />
			</body>
		</html>
	);
}
