#!/usr/bin/env node
/**
 * Renders the responsive variants the custom next/image loader
 * (src/app/lib/image-loader.ts) points at: every raster image in
 * public/pictures, at every width next.config.mjs lets next/image request,
 * as WebP in public/_img/pictures. Widths above an image's native width get
 * the native size, so every URL the loader can produce exists. Variants
 * newer than their source are skipped; run again after adding an image.
 */
import { copyFile, mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { join, parse } from "node:path";
import sharp from "sharp";
import config from "../next.config.mjs";

const SOURCE_DIR = "public/pictures";
const OUT_DIR = "public/_img/pictures";
const WIDTHS = [...config.images.imageSizes, ...config.images.deviceSizes];
const RASTER = /\.(webp|png|jpe?g)$/i;

async function isFresh(target, source) {
    try {
        return (await stat(target)).mtimeMs >= (await stat(source)).mtimeMs;
    } catch {
        return false;
    }
}

await mkdir(OUT_DIR, { recursive: true });
const files = (await readdir(SOURCE_DIR)).filter((file) => RASTER.test(file));
let written = 0;

await Promise.all(files.map(async (file) => {
    const source = join(SOURCE_DIR, file);
    const { name, ext } = parse(file);
    const { width: native } = await sharp(source).metadata();
    const { size: sourceSize } = await stat(source);
    await Promise.all(WIDTHS.map(async (width) => {
        const target = join(OUT_DIR, `${name}-${width}.webp`);
        if (await isFresh(target, source)) return;
        const variant = await sharp(source).resize({ width: Math.min(width, native) }).webp({ quality: 80 }).toBuffer();
        // A tightly compressed WebP can beat its own re-encoded downscale; then ship the original.
        if (ext.toLowerCase() === ".webp" && variant.length >= sourceSize) {
            await copyFile(source, target);
        } else {
            await writeFile(target, variant);
        }
        written++;
    }));
}));

console.log(`optimize-images: ${files.length} images, ${written} variants written to ${OUT_DIR}`);
