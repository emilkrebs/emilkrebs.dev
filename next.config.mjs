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
    ...(process.env.NODE_ENV === "development"
        ? {
              rewrites: () => [
                  { source: "/playground", destination: "/playground/index.html" },
                  { source: "/playground/", destination: "/playground/index.html" },
              ],
          }
        : {}),
};

export default nextConfig;
