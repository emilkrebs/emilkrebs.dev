import { Footer } from './components/footer';
import './globals.css';
import { Metadata } from 'next';

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
				<link rel="canonical" href="https://emilkrebs.dev" />

				<title>Emil Krebs</title>
			</head>

			<body className='font-sans'>
				{children}

				<Footer />
			</body>
		</html>
	);
}
