#!/usr/bin/env node
/**
 * Vendors github.com/emilkrebs/med-research-mcp for the project page at
 * /projects/med-research-mcp/. Resolves main to one commit SHA, then fetches
 * every source by that SHA, never by a floating ref:
 *
 * - the two READMEs and the three SKILL.md files into src/app/content, each
 *   prefixed with a provenance comment the renderer strips, the rest
 *   byte-identical so upstream diffs stay readable;
 * - meta.json with { version, license, sha, syncedAt };
 * - the two demo GIFs and a poster frame each (the frame on screen at ~8 s,
 *   when the results list is populated) into public/pictures;
 * - four byte-deterministic zips into public/downloads: one per skill (a
 *   single top-level folder equal to the slug, holding SKILL.md, the shape
 *   ModelScope serves) and one bundle of all three. Fixed mtime 1980-01-01,
 *   sorted entries, no OS metadata.
 *
 * Usage:
 *   node scripts/sync-project.mjs          # fetch and write what changed
 *   node scripts/sync-project.mjs --check  # fetch and diff, write nothing,
 *                                          # exit 1 on drift (for CI)
 *
 * A sync that changes nothing writes nothing, so syncedAt keeps recording
 * when the content last changed and re-runs stay byte-stable. --check
 * compares content only (version, license, sha), not syncedAt.
 *
 * Never run this from npm run build: a build must not depend on the network.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { deflateRawSync } from "node:zlib";
import sharp from "sharp";

const REPO = "emilkrebs/med-research-mcp";
const CONTENT_DIR = "src/app/content/projects/med-research-mcp";
const MEDIA_DIR = "public/pictures/projects/med-research-mcp";
const DOWNLOAD_DIR = "public/downloads";
// The demo frame used as the poster: the moment the results list is populated.
const POSTER_AT_MS = 8000;

const MARKDOWN_SOURCES = [
    { path: "README.md", out: join(CONTENT_DIR, "readme.en.md") },
    { path: "README.zh-CN.md", out: join(CONTENT_DIR, "readme.zh.md") },
    { path: "skills/med-research/SKILL.md", out: join(CONTENT_DIR, "skill-med-research.md") },
    { path: "skills/med-research-ebm/SKILL.md", out: join(CONTENT_DIR, "skill-med-research-ebm.md") },
    { path: "skills/med-research-setup/SKILL.md", out: join(CONTENT_DIR, "skill-med-research-setup.md") },
];
const SKILLS = ["med-research", "med-research-ebm", "med-research-setup"];
const GIF_SOURCES = [
    { path: "docs/media/med-research-mcp-demo.gif", out: join(MEDIA_DIR, "med-research-mcp-demo.gif"), poster: join(MEDIA_DIR, "poster-en.png") },
    { path: "docs/media/med-research-mcp-demo-zh.gif", out: join(MEDIA_DIR, "med-research-mcp-demo-zh.gif"), poster: join(MEDIA_DIR, "poster-zh.png") },
];

const check = process.argv.includes("--check");

async function fetchBuffer(url) {
    const response = await fetch(url, { headers: { "User-Agent": "emilkrebs.dev-sync-project" } });
    if (!response.ok) throw new Error(`GET ${url}: ${response.status} ${response.statusText}`);
    return Buffer.from(await response.arrayBuffer());
}

/** Resolve main once; everything below is fetched by this SHA. */
async function resolveSha() {
    const response = await fetch(`https://api.github.com/repos/${REPO}/commits/main`, {
        headers: { "User-Agent": "emilkrebs.dev-sync-project", Accept: "application/vnd.github+json" },
    });
    if (!response.ok) throw new Error(`Resolving main: ${response.status} ${response.statusText}`);
    const { sha } = await response.json();
    if (!/^[0-9a-f]{40}$/.test(sha)) throw new Error(`Unexpected SHA: ${sha}`);
    return sha;
}

function provenanceComment(sha, path) {
    return `<!-- vendored from ${REPO}@${sha} ${path}; regenerate with scripts/sync-project.mjs, do not edit -->\n`;
}

// ---------------------------------------------------------------------------
// Deterministic zip writer: local headers + central directory + EOCD, DOS
// mtime 1980-01-01 00:00:00, entries sorted by name, no extra fields, no
// OS metadata (version made by MS-DOS, external attributes 0).
// ---------------------------------------------------------------------------

const CRC_TABLE = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        table[n] = c >>> 0;
    }
    return table;
})();

function crc32(buffer) {
    let crc = 0xffffffff;
    for (const byte of buffer) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
}

/** entries: [{ name, data }]; returns the zip as a Buffer. */
function zip(entries) {
    const sorted = [...entries].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
    const DOS_DATE_1980_01_01 = 0x0021;
    const parts = [];
    const central = [];
    let offset = 0;
    for (const { name, data } of sorted) {
        const nameBytes = Buffer.from(name, "utf8");
        const crc = crc32(data);
        const deflated = deflateRawSync(data, { level: 9 });
        // Store when deflate cannot beat the raw bytes; either way deterministic.
        const method = deflated.length < data.length ? 8 : 0;
        const payload = method === 8 ? deflated : data;

        const local = Buffer.alloc(30);
        local.writeUInt32LE(0x04034b50, 0);
        local.writeUInt16LE(20, 4); // version needed: 2.0
        local.writeUInt16LE(0, 6); // flags: none (names are ASCII)
        local.writeUInt16LE(method, 8);
        local.writeUInt16LE(0, 10); // time: 00:00:00
        local.writeUInt16LE(DOS_DATE_1980_01_01, 12);
        local.writeUInt32LE(crc, 14);
        local.writeUInt32LE(payload.length, 18);
        local.writeUInt32LE(data.length, 22);
        local.writeUInt16LE(nameBytes.length, 26);
        local.writeUInt16LE(0, 28); // extra field length
        parts.push(local, nameBytes, payload);

        const entry = Buffer.alloc(46);
        entry.writeUInt32LE(0x02014b50, 0);
        entry.writeUInt16LE(20, 4); // version made by: 2.0, MS-DOS
        entry.writeUInt16LE(20, 6); // version needed
        entry.writeUInt16LE(0, 8); // flags
        entry.writeUInt16LE(method, 10);
        entry.writeUInt16LE(0, 12);
        entry.writeUInt16LE(DOS_DATE_1980_01_01, 14);
        entry.writeUInt32LE(crc, 16);
        entry.writeUInt32LE(payload.length, 20);
        entry.writeUInt32LE(data.length, 24);
        entry.writeUInt16LE(nameBytes.length, 28);
        // extra, comment, disk, internal attributes: 0
        entry.writeUInt32LE(0, 38); // external attributes: none
        entry.writeUInt32LE(offset, 42);
        central.push(Buffer.concat([entry, nameBytes]));

        offset += local.length + nameBytes.length + payload.length;
    }
    const directory = Buffer.concat(central);
    const end = Buffer.alloc(22);
    end.writeUInt32LE(0x06054b50, 0);
    end.writeUInt16LE(sorted.length, 8);
    end.writeUInt16LE(sorted.length, 10);
    end.writeUInt32LE(directory.length, 12);
    end.writeUInt32LE(offset, 16);
    return Buffer.concat([...parts, directory, end]);
}

/** The GIF frame on screen at POSTER_AT_MS, as a lossless PNG. */
async function posterFrame(gif) {
    const { delay = [] } = await sharp(gif).metadata();
    let elapsed = 0;
    let page = Math.max(0, delay.length - 1);
    for (let i = 0; i < delay.length; i++) {
        if (elapsed >= POSTER_AT_MS) {
            page = i;
            break;
        }
        elapsed += delay[i];
    }
    return sharp(gif, { page }).png().toBuffer();
}

// ---------------------------------------------------------------------------

const sha = await resolveSha();
console.log(`${REPO}@${sha}`);

const raw = new Map();
for (const path of [...MARKDOWN_SOURCES.map((s) => s.path), ...GIF_SOURCES.map((s) => s.path), "package.json"]) {
    raw.set(path, await fetchBuffer(`https://raw.githubusercontent.com/${REPO}/${sha}/${path}`));
}
const pkg = JSON.parse(raw.get("package.json").toString("utf8"));

/** Every output file this sync produces, as { out, data }. */
const outputs = [];
for (const { path, out } of MARKDOWN_SOURCES) {
    outputs.push({ out, data: Buffer.concat([Buffer.from(provenanceComment(sha, path)), raw.get(path)]) });
}
for (const { path, out, poster } of GIF_SOURCES) {
    outputs.push({ out, data: raw.get(path) });
    outputs.push({ out: poster, data: await posterFrame(raw.get(path)) });
}
for (const slug of SKILLS) {
    const data = raw.get(`skills/${slug}/SKILL.md`);
    outputs.push({ out: join(DOWNLOAD_DIR, `${slug}.zip`), data: zip([{ name: `${slug}/SKILL.md`, data }]) });
}
outputs.push({
    out: join(DOWNLOAD_DIR, "med-research-skills.zip"),
    data: zip(SKILLS.map((slug) => ({ name: `${slug}/SKILL.md`, data: raw.get(`skills/${slug}/SKILL.md`) }))),
});

async function readIfPresent(path) {
    try {
        return await readFile(path);
    } catch {
        return null;
    }
}

const changed = [];
for (const { out, data } of outputs) {
    const current = await readIfPresent(out);
    if (!current || !current.equals(data)) changed.push(out);
}

// meta.json: content is version, license and sha; syncedAt records when the
// content last changed, so a no-op sync must not touch it.
const metaPath = join(CONTENT_DIR, "meta.json");
const metaCurrent = await readIfPresent(metaPath);
let metaDrift = !metaCurrent;
if (metaCurrent) {
    try {
        const existing = JSON.parse(metaCurrent.toString("utf8"));
        metaDrift = existing.version !== pkg.version || existing.license !== pkg.license || existing.sha !== sha;
    } catch {
        metaDrift = true;
    }
}

if (check) {
    const drift = [...changed, ...(metaDrift ? [metaPath] : [])];
    if (drift.length > 0) {
        console.error(`Vendored content differs from ${REPO}@${sha}:`);
        for (const file of drift) console.error(`  ${file}`);
        console.error("Run: node scripts/sync-project.mjs");
        process.exit(1);
    }
    console.log(`--check: vendored content matches ${REPO}@${sha}`);
} else if (changed.length === 0 && !metaDrift) {
    console.log(`Already in sync at ${sha}; nothing written.`);
} else {
    const meta = { version: pkg.version, license: pkg.license, sha, syncedAt: new Date().toISOString() };
    const writes = [...outputs, { out: metaPath, data: Buffer.from(`${JSON.stringify(meta, null, 4)}\n`) }];
    for (const { out, data } of writes) {
        await mkdir(dirname(out), { recursive: true });
        await writeFile(out, data);
    }
    console.log(`Synced ${writes.length} files at ${sha} (${pkg.version}, ${pkg.license}).`);
}
