// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
	markdown: {
		shikiConfig: {
			theme: "gruvbox-dark-soft",
		},
		syntaxHighlight: "shiki",
	},
	vite: {
		plugins: [tailwindcss()],
	},
	site: "https://blog.ricardoguzman.dev",
	integrations: [sitemap(), react()],
});
