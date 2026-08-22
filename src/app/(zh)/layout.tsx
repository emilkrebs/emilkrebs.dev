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

export const metadata: Metadata = {
    metadataBase: new URL("https://emilkrebs.dev"),
    title: {
        default: "Emil Krebs - 基尔的软件工程师",
        template: "%s | Emil Krebs",
    },
    description:
    "德国基尔 TypeFox 的软件工程师。我构建读取、理解和转换代码的工具：语言服务器、DSL，以及 Prami 和 Healthstack 等产品。一切以开源发布。",
    keywords: [
        "Emil Krebs",
        "软件工程师",
        "TypeFox GmbH",
        "软件工程",
        "语言服务器协议",
        "Langium",
        "开发者工具",
        "Theia",
        "TypeScript",
        "基尔",
        "德国",
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
        locale: "zh_CN",
        url: "https://emilkrebs.dev/zh/",
        title: "Emil Krebs - 基尔的软件工程师",
        description:
      "德国基尔 TypeFox 的软件工程师。我构建读取、理解和转换代码的工具：语言服务器、DSL，以及 Prami 和 Healthstack 等产品。",
        siteName: "Emil Krebs",
        images: [
            {
                url: "/opengraph_image.webp",
                width: 1200,
                height: 630,
                alt: "Emil Krebs - 基尔的软件工程师",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Emil Krebs - 基尔的软件工程师",
        description:
      "德国基尔 TypeFox 的软件工程师，构建语言服务器、DSL，以及 Prami 和 Healthstack 等产品。",
        images: ["/opengraph_image.webp"],
    },
    icons: {
        icon: "/favicon.svg",
        apple: "/apple-touch-icon.png",
    },
    alternates: {
        canonical: "/zh/",
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
            lang="zh-CN"
            className={`${schibstedGrotesk.variable} ${plexMono.variable} ${instrumentSerif.variable}`}
        >
            <head>
                <meta charSet="UTF-8" />
            </head>
            <body className="overflow-x-hidden min-h-screen flex flex-col">
                <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:bg-ink focus:text-paper focus:px-4 focus:py-2 font-mono text-xs uppercase tracking-[0.08em]"
                >
                    跳到主要内容
                </a>
                <div
                    dangerouslySetInnerHTML={{
                        __html:
              "<!--\nTHESIS: Emil builds the tools that build software. A personal site set as a language specification: warm paper, black ink, one signal accent, sharp corners, flat, no motion; one gimmick: the hero portrait wears a green face-reticle and a Thinking chip.\nOWN-WORLD: paper #f7f5f0, ink #141310, signal #e8450c, signal-accent #22c55e (hero reticle and chip border only), 1px hairlines, Schibsted Grotesk display, IBM Plex Mono labels, one Instrument Serif italic accent phrase per section, 6px square token marks, duotone ID plate portrait with face-reticle, 0px corners everywhere.\nSTORY: The visitor reads a dry spec sheet of a person: who he is, what he is thinking, the four strengths with proof, the shipped products (Prami in preview, Healthstack, the rest), and how to reach him.\nFIRST VIEWPORT: sticky nav (wordmark, mono links, hairline bottom), name at display size, position line, three plain CTAs, duotone ID plate portrait right with a green face-reticle over the face and a Thinking status chip at its top-right corner, token mark row. No scroll cue, no status dot.\nFORM: single page, one column, max 1120px, xl section rhythm; flagship project cards lead the project list, asymmetric grid below.\nFINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md.\nZH: zh-CN variant of the landing page at /zh/; English at / stays the default and fallback, and only the landing is localized while the subpages remain English. Chinese keeps the same type roles and tokens, set in system CJK fallbacks (PingFang SC, Hiragino Sans GB, Noto Sans CJK SC, Microsoft YaHei); the Thinking chip reads 思考中..., captions and status labels are translated, origins and product names stay verbatim. Visitors with a zh-* primary browser language landing on / are auto-redirected here (client-side; locale-pref in localStorage overrides). The bordered EN tag in the nav is the only switcher; it returns to the English page.\n-->",
                    }}
                />
                <script
                    async
                    defer
                    src="https://scripts.simpleanalyticscdn.com/latest.js"
                >
                </script>
                {children}
                <Footer locale="zh" />
            </body>
        </html>
    );
}
