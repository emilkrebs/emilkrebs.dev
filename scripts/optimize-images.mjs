#!/usr/bin/env node
/**
 * Renders the responsive variants the custom next/image loader
 * (src/app/lib/image-loader.ts) points at: every raster image under
 * public/pictures, subfolders included, at every width next.config.mjs lets
 * next/image request, as WebP at the same relative path under
 * public/_img/pictures. Widths above an image's native width get the native
 * size, so every URL the loader can produce exists.
 *
 * A source is rendered again when its content or the encoder settings
 * change, or when one of its variants is missing. The content hashes live in
 * node_modules/.cache, so a fresh install renders everything.
 */
import { createHash } from "node:crypto";
import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, parse } from "node:path";
import sharp from "sharp";
import config from "../next.config.mjs";

const SOURCE_DIR = "public/pictures";
const OUT_DIR = "public/_img/pictures";
const MANIFEST = "node_modules/.cache/optimize-images.json";
const WIDTHS = [...config.images.imageSizes, ...config.images.deviceSizes];
const QUALITY = 80;
// Keep in sync with the loader, which refuses everything else.
const RASTER = /\.(webp|png|jpe?g)$/i;
// Part of every source's hash: changing an encoder setting renders everything again.
const SETTINGS = JSON.stringify({ WIDTHS, QUALITY });

async function exists(path) {
    try {
        await access(path);
        return true;
    } catch {
        return false;
    }
}

async function readManifest() {
    try {
        return JSON.parse(await readFile(MANIFEST, "utf8"));
    } catch {
        return {};
    }
}

const files = (await readdir(SOURCE_DIR, { recursive: true })).filter((file) => RASTER.test(file)).sort();

// The loader drops the extension, so foo.png and foo.webp would write the same variants.
const stems = new Map();
for (const file of files) {
    const { dir, name } = parse(file);
    const stem = join(dir, name);
    if (stems.has(stem)) {
        throw new Error(`optimize-images: ${stems.get(stem)} and ${file} would render to the same variants; rename one.`);
    }
    stems.set(stem, file);
}

const previous = await readManifest();
const manifest = {};
let written = 0;

await Promise.all(files.map(async (file) => {
    const source = await readFile(join(SOURCE_DIR, file));
    const hash = createHash("sha256").update(SETTINGS).update(source).digest("hex");
    manifest[file] = hash;

    const { dir, name, ext } = parse(file);
    const target = (width) => join(OUT_DIR, dir, `${name}-${width}.webp`);
    if (previous[file] === hash && (await Promise.all(WIDTHS.map((width) => exists(target(width))))).every(Boolean)) {
        return;
    }

    await mkdir(join(OUT_DIR, dir), { recursive: true });
    const { width: native } = await sharp(source).metadata();
    // Every width at or above the native width is the same image: encode each distinct size once.
    const widthsBySize = Map.groupBy(WIDTHS, (width) => Math.min(width, native));
    await Promise.all([...widthsBySize].map(async ([size, widths]) => {
        const variant = await sharp(source).resize({ width: size }).webp({ quality: QUALITY }).toBuffer();
        // A tightly compressed WebP can beat its own re-encoded downscale; then ship the original.
        const output = ext.toLowerCase() === ".webp" && variant.length >= source.length ? source : variant;
        await Promise.all(widths.map((width) => writeFile(target(width), output)));
        written += widths.length;
    }));
}));

await mkdir(dirname(MANIFEST), { recursive: true });
await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 4)}\n`);

console.log(`optimize-images: ${files.length} images, ${written} variants written to ${OUT_DIR}`);
