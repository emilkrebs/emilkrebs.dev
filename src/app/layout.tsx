import { Footer } from "./components/footer";
import "./globals.css";
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
	metadataBase: new URL("https://emilkrebs.dev"),
	title: "Emil Krebs",
	description: "I am a software engineer with expertise in web development and Android applications. I am constantly growing and learning new skills every day.",
	icons: [
		"/favicon.svg",
		"/favicon.ico"
	],
	authors: [
		{
			name: "Emil Krebs",
			url: "https://emilkrebs.dev"
		}
	],
	creator: "Emil Krebs",
	robots: "index, follow",
	openGraph: {
		type: "website",
		title: "Emil Krebs",
		description: "I am a software engineer with expertise in web development and Android applications. I am constantly growing and learning new skills every day.",
		images: [
			{
				url: "/opengraph_image.webp",
				width: 1200,
				height: 630,
				alt: "Emil Krebs"
			}
		]
	}
};

export const viewport: Viewport = {
	themeColor: "#4A148C",
	colorScheme: "dark light",
	initialScale: 1,
	width: "device-width",
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
			<body className="font-sans overflow-x-hidden">
				{children}
				<Footer />
			</body>
		</html>
	);
}
