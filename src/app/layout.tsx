import './globals.css';
import Footer from './components/footer';
import Navbar from './components/navbar';
import { Metadata } from 'next';
import { Components } from 'react-markdown';

export const metadata: Metadata = {
	title: 'Emil Krebs',
	description: 'Emil Krebs Website',
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
