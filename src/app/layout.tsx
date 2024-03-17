import './globals.css';
import { Metadata } from 'next';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Emil Krebs',
	description: 'Emil Krebs Website',
};

function Navbar() {
	const pathname = usePathname();
	if(pathname === '/') return null;
	return (
		<nav className="flex w-full justify-start items-center gap-4 p-4">
			<Link href="/" className="border-2 rounded-lg p-4">
                Home
			</Link>
		</nav>
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

				<title>Emil Krebs</title>
			</head>

			<body className='font-sans'>
				<Navbar />

				{children}
				
				{/* Footer */}
				<footer className="flex flex-col sm:flex-row items-center justify-between w-full gap-y-4 bg-black px-16 py-4">
					<a className="uppercase text-lg hover:underline" href="/imprint">Imprint</a>

					{/* GitHub */}
					<a
						href="https://github.com/emilkrebs/emilkrebs-website"
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
			</body>
		</html>
	);
}
