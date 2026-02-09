import { defineCollection, z } from "astro:content";

import { glob } from "astro/loaders";

const blogCollection = defineCollection({
	loader: glob({
		pattern: "**/*.md",
		base: "./src/content/posts",
	}),
	schema: z.object({
		slug: z.string(),
		title: z.string(),
		pubDateString: z.string(),
		pubDate: z.date(),
		updateDateString: z.string().optional(),
		updateDate: z.date().optional(),
		tags: z.array(z.string()),
		author: z.string(),
		image: z.string().optional(),
		imageAlt: z.string().optional(),
		description: z.string(),
		ogDescription: z.string().optional(),
		twitterDescription: z.string().optional(),
	}),
});

export const collections = { blogCollection };
