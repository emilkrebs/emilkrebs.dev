import { Footer } from './components/footer';
import './globals.css';
import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
	metadataBase: new URL('https://emilkrebs.dev'),
	title: {
		default: 'Emil Krebs - Full-Stack Software Engineer',
		template: '%s | Emil Krebs'
	},
	description: 'Passionate full-stack software engineer from Kiel, Germany, specializing in TypeScript, React, Next.js, Android development, and open-source contributions. Available for freelance projects and full-time opportunities.',
	keywords: [
		'Emil Krebs',
		'Full-Stack Developer',
		'Software Engineer', 
		'TypeScript',
		'React',
		'Next.js',
		'Android Development',
		'Kotlin',
		'Web Development',
		'Mobile Development',
		'Open Source',
		'Freelance Developer',
		'Germany',
		'Kiel'
	],
	authors: [
		{
			name: 'Emil Krebs',
			url: 'https://emilkrebs.dev'
		}
	],
	creator: 'Emil Krebs',
	publisher: 'Emil Krebs',
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1
		}
	},
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: 'https://emilkrebs.dev',
		title: 'Emil Krebs - Full-Stack Software Engineer',
		description: 'Passionate full-stack software engineer from Kiel, Germany, specializing in TypeScript, React, Next.js, Android development, and open-source contributions.',
		siteName: 'Emil Krebs Portfolio',
		images: [
			{
				url: '/opengraph_image.webp',
				width: 1200,
				height: 630,
				alt: 'Emil Krebs - Full-Stack Software Engineer Portfolio'
			}
		]
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Emil Krebs - Full-Stack Software Engineer',
		description: 'Passionate full-stack software engineer from Kiel, Germany, specializing in TypeScript, React, Next.js, Android development, and open-source contributions.',
		images: ['/opengraph_image.webp']
	},
	icons: {
		icon: '/favicon.svg',
		shortcut: '/favicon.ico',
		apple: '/favicon.svg'
	},
	verification: {
		google: 'verification_token_here' // Add your Google Search Console verification
	}
};

export const viewport: Viewport = {
	themeColor: '#4A148C',
	colorScheme: 'dark light',
	initialScale: 1,
	width: 'device-width',
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
				<link rel="canonical" href="https://emilkrebs.dev" />
			</head>
			<script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
			<body className="overflow-x-hidden">
				{children}
				<Footer />
			</body>
		</html>
	);
}
