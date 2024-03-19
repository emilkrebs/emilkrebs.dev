import { Footer } from './components/footer';
import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
	metadataBase: new URL('https://emilkrebs.dev'),
	title: 'emilkrebs.dev',
	description: 'Emil Krebs is a software engineer with expertise in web development and Android applications. He is also an active contributor to open-source projects.',
	icons: [
		'/favicon.svg',
		'/favicon.ico'
	],
	themeColor: '#4A148C',
	colorScheme: 'dark light',
	authors: [
		{
			name: 'Emil Krebs',
			url: 'https://emilkrebs.dev'
		}
	],
	creator: 'Emil Krebs',
	robots: 'index, follow',
	openGraph: {
		type: 'website',
		title: 'Emil Krebs',
		description: 'Emil Krebs is a software engineer with expertise in web development and Android applications. He is also an active contributor to open-source projects.',
		images: [
			{
				url: '/opengraph_image.webp',
				width: 1200,
				height: 591,
				alt: 'Emil Krebs'
			}
		]
	}
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
