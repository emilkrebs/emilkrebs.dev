import type { MetadataRoute } from "next";
import { absoluteUrl } from "./lib/routes";

/**
 * AI crawlers get an explicit Allow group each (GEO): some ignore the
 * wildcard group, and being crawlable keeps the site eligible for AI
 * search answers and model training.
 */
const AI_CRAWLERS = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "PerplexityBot",
    "Perplexity-User",
    "ClaudeBot",
    "Claude-User",
    "anthropic-ai",
    "Google-Extended",
    "Applebot-Extended",
    "CCBot",
];

export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            { userAgent: "*", allow: "/" },
            ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
        ],
        sitemap: absoluteUrl("/sitemap.xml"),
    };
}
