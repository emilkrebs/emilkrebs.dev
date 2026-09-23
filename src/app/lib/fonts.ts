import {
    IBM_Plex_Mono,
    Instrument_Serif,
    Schibsted_Grotesk,
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

/** The CSS variable classes for `<html>`; globals.css maps them to font families. */
export const fontVariables = `${schibstedGrotesk.variable} ${plexMono.variable} ${instrumentSerif.variable}`;
