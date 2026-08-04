import { Footer } from "./components/footer";
import "./globals.css";
import { Metadata, Viewport } from "next";
import {
    Schibsted_Grotesk,
    IBM_Plex_Mono,
    Instrument_Serif,
} from "next/font/google";

const schibstedGrotesk = Schibsted_Grotesk({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-schibsted-grotesk",
    display: "swap",
});

const plexMono = IBM_Plex_Mono({
    subsets: ["latin"],
    weight: ["400", "500"],
    variable: "--font-plex-mono",
    display: "swap",
});

const instrumentSerif = Instrument_Serif({
    subsets: ["latin"],
    weight: "400",
    style: "italic",
    variable: "--font-instrument-serif",
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL("https://emilkrebs.dev"),
    title: {
        default: "Emil Krebs - Language Engineer in Kiel",
        template: "%s | Emil Krebs",
    },
    description:
    "Language engineer at TypeFox in Kiel, Germany. I build the tools that read, understand, and transform code: language servers, DSLs, and products like Prami and Healthstack. Everything ships open source.",
    keywords: [
        "Emil Krebs",
        "Language Engineer",
        "TypeFox GmbH",
        "Language Engineering",
        "Language Server Protocol",
        "Langium",
        "Developer Tools",
        "Theia",
        "TypeScript",
        "Kiel",
        "Germany",
        "Prami",
        "Healthstack",
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
        title: "Emil Krebs - Language Engineer in Kiel",
        description:
      "Language engineer at TypeFox in Kiel, Germany. I build the tools that read, understand, and transform code: language servers, DSLs, and products like Prami and Healthstack.",
        siteName: "Emil Krebs",
        images: [
            {
                url: "/opengraph_image.webp",
                width: 1200,
                height: 630,
                alt: "Emil Krebs - Language Engineer in Kiel",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Emil Krebs - Language Engineer in Kiel",
        description:
      "Language engineer at TypeFox in Kiel, Germany, building language servers, DSLs, and products like Prami and Healthstack.",
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
    themeColor: "#f7f5f0",
    colorScheme: "light",
    initialScale: 1,
    width: "device-width",
};

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${schibstedGrotesk.variable} ${plexMono.variable} ${instrumentSerif.variable}`}
        >
            <head>
                <meta charSet="UTF-8" />
                <link rel="canonical" href="https://emilkrebs.dev" />
            </head>
            <body className="overflow-x-hidden min-h-screen flex flex-col">
                <div
                    dangerouslySetInnerHTML={{
                        __html:
              "<!--\nTHESIS: Emil builds the tools that build software. A personal site set as a language specification: warm paper, black ink, one signal accent, sharp corners, flat, no motion.\nOWN-WORLD: paper #f7f5f0, ink #141310, signal #e8450c, 1px hairlines, Schibsted Grotesk display, IBM Plex Mono labels, one Instrument Serif italic accent phrase per section, 6px square token marks, duotone ID plate portrait, 0px corners everywhere.\nSTORY: The visitor reads a dry spec sheet of a person: who he is, what he is cooking, the four strengths with proof, the shipped products (Prami in preview, Healthstack, the rest), and how to reach him.\nFIRST VIEWPORT: sticky nav (wordmark, mono links, hairline bottom), name at display size, position line, mono cooking line, two plain CTAs, duotone ID plate portrait right, token mark row. No scroll cue, no status dot.\nFORM: single page, one column, max 1120px, xl section rhythm; flagship project cards lead the project list, asymmetric grid below.\nFINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md.\n-->",
                    }}
                />
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
