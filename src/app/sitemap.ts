import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://emilkrebs.dev",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1,
            alternates: {
                languages: {
                    en: "/",
                    zh: "/zh/",
                    "x-default": "/",
                },
            },
        },
        {
            url: "https://emilkrebs.dev/zh/",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.9,
            alternates: {
                languages: {
                    en: "/",
                    zh: "/zh/",
                    "x-default": "/",
                },
            },
        },
        {
            url: "https://emilkrebs.dev/healthstack",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: "https://emilkrebs.dev/story",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: "https://emilkrebs.dev/imprint",
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: "https://emilkrebs.dev/privacy",
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ];
}