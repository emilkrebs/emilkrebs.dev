import { Footer } from "./components/footer";
import "./globals.css";
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
    metadataBase: new URL("https://emilkrebs.dev"),
    title: {
        default: "Emil Krebs - Software Engineer at TypeFox GmbH",
        template: "%s | Emil Krebs",
    },
    description:
    "Software engineer at TypeFox GmbH from Kiel, Germany, specializing in language engineering, developer tools, TypeScript, and open-source contributions.",
    keywords: [
        "Emil Krebs",
        "Software Engineer",
        "TypeFox GmbH",
        "Language Engineering",
        "Developer Tools",
        "TypeScript",
        "VS Code Extensions",
        "Language Server Protocol",
        "React",
        "Next.js",
        "Web Development",
        "Open Source",
        "Germany",
        "Kiel",
    ],
    authors: [
        {
            name: "Emil Krebs",
            url: "https://emilkrebs.dev",
        },
    ],
    creator: "Emil Krebs",
    publisher: "Emil Krebs",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://emilkrebs.dev",
        title: "Emil Krebs - Software Engineer at TypeFox GmbH",
        description:
      "Software engineer at TypeFox GmbH from Kiel, Germany, specializing in language engineering, developer tools, and open-source contributions.",
        siteName: "Emil Krebs",
        images: [
            {
                url: "/opengraph_image.webp",
                width: 1200,
                height: 630,
                alt: "Emil Krebs - Software Engineer at TypeFox GmbH",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Emil Krebs - Software Engineer at TypeFox GmbH",
        description:
      "Software engineer at TypeFox GmbH from Kiel, Germany, specializing in language engineering, developer tools, and open-source contributions.",
        images: ["/opengraph_image.webp"],
    },
    icons: {
        icon: "/favicon.svg",
        shortcut: "/favicon.ico",
        apple: "/favicon.svg",
    },
    verification: {
        google: "verification_token_here", // Add your Google Search Console verification
    },
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
            <body className="overflow-x-hidden">
                <script
                    async
                    defer
                    src="https://scripts.simpleanalyticscdn.com/latest.js"
                >
                </script>
                {children}
                <Footer />
            </body>
        </html>
    );
}
