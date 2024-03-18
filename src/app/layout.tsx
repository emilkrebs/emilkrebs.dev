import './globals.css';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
	title: 'Emil Krebs',
	description: 'Emil Krebs Website',
};


function Footer() {
	return (
		<footer className="flex flex-col sm:flex-row items-center justify-between w-full gap-y-4 bg-black px-16 py-4">
			<a className="uppercase text-lg hover:underline" href="/imprint">Imprint</a>

			{/* GitHub */}
			<a
				href="https://github.com/emilkrebs/emilkrebs.dev"
				target="_blank"
			>
				<Image
					className="filter-white"
					src="/icons/github.svg"
					alt="GitHub"
					width={32}
					height={32}
				/>
			</a>

			<a className="uppercase text-lg hover:underline" href="/privacy">Privacy Policy</a>
		</footer>
	);
}

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
