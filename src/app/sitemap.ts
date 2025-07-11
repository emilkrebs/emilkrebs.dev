import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://emilkrebs.dev";
	const currentDate = new Date();

	return [
		{
			url: baseUrl,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${baseUrl}/imprint`,
			lastModified: currentDate,
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{
			url: `${baseUrl}/privacy`,
			lastModified: currentDate,
			changeFrequency: "yearly",
			priority: 0.3,
		},
	];
}
