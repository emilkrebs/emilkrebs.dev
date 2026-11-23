#!/usr/bin/env node
/**
 * Vendors github.com/emilkrebs/med-research-mcp for the project page at
 * /med-research-mcp/. Resolves main to one commit SHA, then fetches
 * every source by that SHA, never by a floating ref:
 *
 * - the two READMEs and the three SKILL.md files into src/app/content, each
 *   prefixed with a provenance comment the renderer strips, the rest
 *   byte-identical so upstream diffs stay readable;
 * - the same three SKILL.md files, unmodified and without the provenance
 *   comment, into public/downloads as plain markdown: a visitor takes a skill
 *   without unpacking anything;
 * - the two demo recordings, converted to animated WebP, into
 *   public/media/med-research-mcp;
 * - meta.json with { version, license, sha, syncedAt }.
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
import sharp from "sharp";

const REPO = "emilkrebs/med-research-mcp";
const CONTENT_DIR = "src/app/content/med-research-mcp";
const MEDIA_DIR = "public/media/med-research-mcp";
const DOWNLOAD_DIR = "public/downloads";

const SKILLS = ["med-research", "med-research-ebm", "med-research-setup"];

const MARKDOWN_SOURCES = [
    { path: "README.md", out: join(CONTENT_DIR, "readme.en.md") },
    { path: "README.zh-CN.md", out: join(CONTENT_DIR, "readme.zh.md") },
    ...SKILLS.map((slug) => ({
        path: `skills/${slug}/SKILL.md`,
        out: join(CONTENT_DIR, `skill-${slug}.md`),
        // The same bytes, minus our provenance line, as a plain download.
        download: join(DOWNLOAD_DIR, `${slug}.md`),
    })),
];
const GIF_SOURCES = [
    { path: "docs/media/med-research-mcp-demo.gif", out: join(MEDIA_DIR, "med-research-mcp-demo.webp") },
    { path: "docs/media/med-research-mcp-demo-zh.gif", out: join(MEDIA_DIR, "med-research-mcp-demo-zh.webp") },
];
// Animated WebP is what ships: same frames, roughly a third of the bytes of
// the upstream GIF, and every current browser plays it. 1120px matches the
// page's widest content column, so the plate never upscales.
const DEMO_WIDTH = 1120;
const DEMO_QUALITY = 55;

/** Upstream GIF frames re-encoded as one animated WebP. */
async function toAnimatedWebp(gif) {
    return sharp(gif, { animated: true })
        .resize({ width: DEMO_WIDTH })
        .webp({ quality: DEMO_QUALITY, effort: 6 })
        .toBuffer();
}

const check = process.argv.includes("--check");

async function fetchBuffer(url) {
    const response = await fetch(url, { headers: { "User-Agent": "emilkrebs.dev-sync-project" } });
    if (!response.ok) throw new Error(`GET ${url}: ${response.status} ${response.statusText}`);
    return Buffer.from(await response.arrayBuffer());
}

/** Resolve main once; everything below is fetched by this SHA. */
async function resolveSha() {
    // Authenticate when a token is present (CI passes GITHUB_TOKEN). The
    // unauthenticated api.github.com limit is 60/hr per IP, which shared
    // Actions runners exhaust -> 403 rate limit exceeded. A token raises it
    // to 5000/hr. raw.githubusercontent.com below stays unauthenticated.
    const headers = { "User-Agent": "emilkrebs.dev-sync-project", Accept: "application/vnd.github+json" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const response = await fetch(`https://api.github.com/repos/${REPO}/commits/main`, { headers });
    if (!response.ok) throw new Error(`Resolving main: ${response.status} ${response.statusText}`);
    const { sha } = await response.json();
    if (!/^[0-9a-f]{40}$/.test(sha)) throw new Error(`Unexpected SHA: ${sha}`);
    return sha;
}

function provenanceComment(sha, path) {
    return `<!-- vendored from ${REPO}@${sha} ${path}; regenerate with scripts/sync-project.mjs, do not edit -->\n`;
}

// ---------------------------------------------------------------------------

const sha = await resolveSha();
console.log(`${REPO}@${sha}`);

const raw = new Map();
const fetchPaths = [...MARKDOWN_SOURCES.map((s) => s.path), ...GIF_SOURCES.map((s) => s.path), "package.json"];
for (const path of fetchPaths) {
    raw.set(path, await fetchBuffer(`https://raw.githubusercontent.com/${REPO}/${sha}/${path}`));
}
const pkg = JSON.parse(raw.get("package.json").toString("utf8"));

/** Every output file this sync produces, as { out, data }. */
const outputs = [];
for (const { path, out, download } of MARKDOWN_SOURCES) {
    outputs.push({ out, data: Buffer.concat([Buffer.from(provenanceComment(sha, path)), raw.get(path)]) });
    if (download) outputs.push({ out: download, data: raw.get(path) });
}
for (const { path, out } of GIF_SOURCES) {
    outputs.push({ out, data: await toAnimatedWebp(raw.get(path)) });
}

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