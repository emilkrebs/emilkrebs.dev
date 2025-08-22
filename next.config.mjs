/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	output: "export",
	distDir: "out",
	assetPrefix: "./",
	allowedDevOrigins: ["localhost:3000"],
	images: {
		domains: ["github.com"],
		unoptimized: true
	},
	trailingSlash: true,
	compiler: {
		removeConsole: process.env.NODE_ENV === "production"
	}
};

export default nextConfig;
