import type { Metadata, Viewport } from "next";
import { RootShell } from "../components/root-shell";
import { siteMetadata, viewport as siteViewport } from "../lib/metadata";

export const metadata: Metadata = siteMetadata("en");
export const viewport: Viewport = siteViewport;

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return <RootShell locale="en">{children}</RootShell>;
}
