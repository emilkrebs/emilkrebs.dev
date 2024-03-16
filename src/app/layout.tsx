
import { Montserrat } from 'next/font/google';
import './globals.css';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

const inter = Montserrat({ subsets: ['latin'] });

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
				<link rel="icon" href="/favicon.ico" />

				<title>Emil Krebs</title>
			</head>

			<body className={inter.className}>
				<Navbar />
				{children}

				<Footer />
			</body>
		</html>
	);
}
