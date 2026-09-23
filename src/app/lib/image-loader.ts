import type { ImageLoaderProps } from "next/image";

// The formats scripts/optimize-images.mjs renders; keep the two in sync.
const RASTER = /\.(webp|png|jpe?g)$/i;

/**
 * next/image loader for the static export, which has no image server.
 * scripts/optimize-images.mjs renders every raster image under
 * public/pictures, subfolders included, at every width next.config.mjs
 * allows, as /_img/pictures/<path>-<width>.webp; this loader points srcset
 * at them.
 */
export default function imageLoader({ src, width }: ImageLoaderProps): string {
    if (!src.startsWith("/pictures/") || !RASTER.test(src)) {
        throw new Error(`No responsive variants for "${src}": keep raster images (WebP, PNG, JPEG) under public/pictures, or pass unoptimized.`);
    }
    return `/_img${src.replace(/\.[^./]+$/, "")}-${width}.webp`;
}
