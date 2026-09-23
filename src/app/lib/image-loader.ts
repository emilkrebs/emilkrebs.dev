import type { ImageLoaderProps } from "next/image";

/**
 * next/image loader for the static export, which has no image server.
 * scripts/optimize-images.mjs renders every raster image under
 * public/pictures at every width next.config.mjs allows, as
 * /_img/pictures/<name>-<width>.webp; this loader points srcset at them.
 */
export default function imageLoader({ src, width }: ImageLoaderProps): string {
    if (!src.startsWith("/pictures/")) {
        throw new Error(`No responsive variants for "${src}": keep raster images under public/pictures, or pass unoptimized.`);
    }
    return `/_img${src.replace(/\.[^./]+$/, "")}-${width}.webp`;
}
