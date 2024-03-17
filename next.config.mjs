/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	output: 'export',
	distDir: 'out',
	assetPrefix: '/',
	images: {
		domains: ['github.com'],
	},
};

export default nextConfig;
