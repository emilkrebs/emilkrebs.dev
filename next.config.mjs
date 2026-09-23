import createMDX from "@next/mdx";

const withMDX = createMDX({});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Exports to out/; build and dev internals stay in .next/, so a build
    // never touches a running dev server's files.
    output: "export",
    allowedDevOrigins: ["localhost:3000"],
    images: {
        // The static export has no image server: scripts/optimize-images.mjs
        // renders a WebP per width below, and the loader points srcset at them.
        loader: "custom",
        loaderFile: "./src/app/lib/image-loader.ts",
        deviceSizes: [640, 960, 1280, 1920],
        imageSizes: [256, 512],
    },
    trailingSlash: true,
    compiler: {
        removeConsole: process.env.NODE_ENV === "production",
    },
    experimental: {
        // Two root layouts leave no shared one for a 404: see src/app/global-not-found.tsx.
        globalNotFound: true,
    },
};

export default withMDX(nextConfig);
