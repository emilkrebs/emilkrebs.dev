/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	output: 'export',
	distDir: 'out',
	assetPrefix: './',
	images: {
		domains: ['github.com'],
		unoptimized: true,
		minimumCacheTTL: 3600,
	},
};

export default nextConfig;
