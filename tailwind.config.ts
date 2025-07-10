import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Montserrat", "sans-serif"],
			},
			colors: {
				purple: {
					50: "#faf5ff",
					100: "#f3e8ff",
					200: "#e9d5ff",
					300: "#d8b4fe",
					400: "#c084fc",
					500: "#a855f7",
					600: "#9333ea",
					700: "#7c3aed",
					800: "#6b21a8",
					900: "#581c87",
				},
			},
			animation: {
				"float": "float 6s ease-in-out infinite",
				"fade-in": "fadeIn 0.6s ease-out",
				"slide-up": "slideUp 0.6s ease-out",
			},
			backdropBlur: {
				xs: "2px",
			}
		},
	},
	plugins: [],
};
export default config;
