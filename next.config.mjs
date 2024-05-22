/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	output: 'export',
	distDir: 'out',
	assetPrefix: './',
	images: {
		domains: ['github.com'],
		unoptimized: true,
		minimumCacheTTL: 60 * 60 * 6 // 6 hours
	},
};

export default nextConfig;
