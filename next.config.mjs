import createMDX from "@next/mdx";

const withMDX = createMDX({});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: "export",
    distDir: "out",
    assetPrefix: "/",
    allowedDevOrigins: ["localhost:3000"],
    images: {
        remotePatterns: [{ protocol: "https", hostname: "github.com" }],
        unoptimized: true,
    },
    trailingSlash: true,
    compiler: {
        removeConsole: process.env.NODE_ENV === "production",
    },
};

export default withMDX(nextConfig);
