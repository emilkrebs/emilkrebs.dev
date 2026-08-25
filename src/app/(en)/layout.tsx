import { Footer } from "../components/footer";
import "../globals.css";
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

const redirectScript =
  "(function(){try{var p=(navigator.languages&&navigator.languages.length)?navigator.languages[0]:navigator.language;var zh=(p||'').toLowerCase().indexOf('zh')===0;var pref=null;try{pref=localStorage.getItem('locale-pref')}catch(e){}if(zh&&pref!=='en'&&(location.pathname==='/'||location.pathname===''))location.replace('/zh/')}catch(e){}})();";

export const metadata: Metadata = {
    metadataBase: new URL("https://emilkrebs.dev"),
    title: {
        default: "Emil Krebs - Software engineer in Kiel",
        template: "%s | Emil Krebs",
    },
    description:
    "Software engineer at TypeFox in Kiel, Germany. I build the tools that read, understand, and transform code: language servers, DSLs, and products like Prami and Healthstack. Everything ships open source.",
    keywords: [
        "Emil Krebs",
        "Software engineer",
        "TypeFox GmbH",
        "Software engineering",
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
        title: "Emil Krebs - Software engineer in Kiel",
        description:
      "Software engineer at TypeFox in Kiel, Germany. I build the tools that read, understand, and transform code: language servers, DSLs, and products like Prami and Healthstack.",
        siteName: "Emil Krebs",
        images: [
            {
                url: "/opengraph_image.webp",
                width: 1200,
                height: 630,
                alt: "Emil Krebs - Software engineer in Kiel",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Emil Krebs - Software engineer in Kiel",
        description:
      "Software engineer at TypeFox in Kiel, Germany, building language servers, DSLs, and products like Prami and Healthstack.",
        images: ["/opengraph_image.webp"],
    },
    icons: {
        icon: "/favicon.svg",
        apple: "/apple-touch-icon.png",
    },
    alternates: {
        canonical: "/",
        languages: {
            en: "/",
            zh: "/zh/",
            "x-default": "/",
        },
    },
    verification: {},
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#f7f5f0" },
        { media: "(prefers-color-scheme: dark)", color: "#141310" },
    ],
    colorScheme: "light dark",
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
                <script>{redirectScript}</script>
            </head>
            <body className="overflow-x-hidden min-h-screen flex flex-col">
                <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:bg-ink focus:text-paper focus:px-4 focus:py-2 font-mono text-xs uppercase tracking-[0.08em]"
                >
                    Skip to content
                </a>
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
