# Project page spec: /projects/med-research-mcp/

**Status:** SUPERSEDED — implemented in PR #274 (2026-11-18). The settled design decisions live in DESIGN.md (the `/projects/med-research-mcp` entry and §Motion); where this spec conflicts with DESIGN.md or the shipped code, those win. Kept for the upstream asset facts and the acceptance checks.
**Target repo:** `github.com/emilkrebs/med-research-mcp` (public, default branch `main`). No local clone: everything is read from GitHub at a pinned commit.
**Site repo:** this one. Next 16.4.5, `output: "export"`, `trailingSlash: true`.

---

## 1. Goal

One page per public project, starting with this one, so that the canonical share link for a project is `emilkrebs.dev` rather than a third-party listing. The page must keep working for a visitor in mainland China, must survive the delisting or re-skinning of any third-party service, and must render the agent skills, which no repository listing displays usefully.

Non-goals: mirroring documentation, replacing GitHub as the source of truth, a generic pipeline for projects that have no README worth publishing, analytics, comments, changelogs, live download counters.

## 2. Source of truth

`github.com/emilkrebs/med-research-mcp@main`, read at the commit SHA the sync resolves, never at a floating ref during a build.

Known state at the time of writing, which the implementation can rely on:

- `main` tip contains the demo block: commit `b28f2da` ("docs(readme): show a real search in the English and Chinese READMEs", PR #23, merged 2026-11-17). `README.md` references `docs/media/med-research-mcp-demo.gif`, `README.zh-CN.md` references `docs/media/med-research-mcp-demo-zh.gif`.
- Latest release `v0.8.0` (2026-11-16), `package.json` version `0.8.0`, license MIT.
- `skills/med-research/SKILL.md` (19,072 B), `skills/med-research-ebm/SKILL.md` (17,770 B), `skills/med-research-setup/SKILL.md` (9,300 B).
- The demo GIFs are 1280×720, 15 fps, 10.47 s; 3,463,841 B (EN) and 3,196,207 B (ZH).

Sources to vendor, all fetched by SHA:

| Upstream path | Purpose |
|---|---|
| `README.md` | page body (EN) |
| `README.zh-CN.md` | page body (ZH) |
| `package.json` | version, license |
| `skills/med-research/SKILL.md` | skill card |
| `skills/med-research-ebm/SKILL.md` | skill card |
| `skills/med-research-setup/SKILL.md` | skill card |
| `docs/media/med-research-mcp-demo.gif` | demo, EN |
| `docs/media/med-research-mcp-demo-zh.gif` | demo, ZH |

## 3. Page contract

The page must contain, in this order. Layout, typography and interaction detail are the implementer's call, subject to §6.

1. A way back into the site (the existing back-header component).
2. A head: project name, a status line (version and licence are both available from `package.json`), one sentence saying what the project is, and outbound links to npm, GitHub and ModelScope.
3. The demo: one of the two GIFs, chosen by locale, playing on load.
4. The README body, rendered, Chrome-free.
5. The three skills, each readable in place and downloadable as the `SKILL.md` itself.
6. A provenance line: which commit the page was rendered from, and when it was synced.

The page must not contain: shields.io badges, third-party badge images of any kind, download or like counters copied from ModelScope, a summary block above the README that restates it, or any asset served from a host other than `emilkrebs.dev`.

Reuse before inventing: `src/app/lib/routes.ts`, `pageMetadata`, `projectPageSchema`, `SmartLink`, the back-header, the tag/status-label components, `public/og/*.jpg` conventions.

## 4. Architecture

Routes, added to `ROUTES` in `src/app/lib/routes.ts`:

```ts
project_med_research: {
    paths: { en: "/projects/med-research-mcp/", zh: "/zh/projects/med-research-mcp/" },
    index: true,
},
```

`/zh/story/` already exists, so a translated subpage is an established pattern; the sitemap, canonical and hreflang follow from the table with no extra wiring.

Suggested file set, adjustable:

```
src/app/(en)/projects/med-research-mcp/page.tsx
src/app/(zh)/zh/projects/med-research-mcp/page.tsx
src/app/components/project-page.tsx        # shell shared by both locales
src/app/components/readme.tsx              # README renderer
src/app/content/projects/med-research-mcp/{readme.en.md,readme.zh.md,skill-*.md,meta.json}
scripts/sync-project.mjs                   # vendoring + markdown downloads + --check
public/pictures/projects/med-research-mcp/ # demo gif per locale
public/downloads/                          # generated markdown downloads
public/og/med-research-mcp.jpg             # 1200×630 unfurl card
```

Also change the landing card `href` at `src/app/components/landing.tsx:55` from the GitHub URL to the page (the array is shared by both locales).

## 5. Vendoring

`scripts/sync-project.mjs`:

- Resolve `main` → commit SHA once, then fetch every source in §2 by that SHA. Record `{ version, sha, syncedAt }` in `meta.json`.
- Prefix every vendored `.md` with a provenance comment the renderer strips, and leave the rest byte-identical so upstream diffs stay readable.
- Write the three `SKILL.md` files into `public/downloads/<slug>.md` exactly as upstream ships them: frontmatter included, no provenance comment, so a client can use the file as it is. Plain markdown, not archives: nothing here needs unpacking, and a `.md` opens in the same editor the skill is meant for.
- `--check` mode: fetch, diff, write nothing, exit non-zero on any difference, listing the changed files. Meant for CI. It must never run as part of `npm run build`; a build must not depend on the network.

## 6. Constraints

These come from `DESIGN.md` and from the goal in §1. Anything below is a hard requirement; anything not mentioned is design freedom.

- **No third-party assets.** No remote images, fonts or scripts. The page must render completely with the network restricted to `emilkrebs.dev`.
- **Motion.** `DESIGN.md` §Motion: the page does not move on load and nothing animates by itself. The demo recording is the documented exception, scoped to `/projects/...` pages: a recording of the tool working is that page's evidence, and a click gate made the strongest asset on the page behave like an unpicked video. Any other moving element still needs its own sanctioned exception.
- **Palette.** One accent. The skill icon is the project's own colour (`#20c7b5` in the file); the implementer decides whether it renders in its own colour as a documented exception, or inherits site ink. Either way `DESIGN.md` is amended in the same change.
- **The "only product page" clause.** `DESIGN.md:167` currently reads that `/healthstack` is the only product page. Amend it to separate platform pages from record pages.
- **Static export limits.** No rewrites, no server. `src/app/lib/image-loader.ts` and `scripts/optimize-images.mjs` only handle `webp|png|jpe?g`, so a GIF cannot go through `next/image` with the custom loader (it throws) and is never given variants. Raster posters can. Keep asset filenames distinct so the optimizer's stem-collision guard cannot fire.
- **The README is GitHub-flavoured.** Raw HTML (`<p align>`, `<h1>`, `<img>`, `<sub>`), one `[!IMPORTANT]` alert, 16 table rows and three in-page anchors. The site renderer today supports none of that (`src/app/components/markdown.tsx` has no GFM, no raw HTML, no slugs). Whatever renders it must handle all four, and the result must look like a section of this site rather than an embedded document.
- **Anchors.** `#install`, `#privacy` and `#medical-disclaimer` are linked from the README body and must resolve on the page.
- **Relative links.** `docs/*.md` links must be rewritten to GitHub at the pinned SHA, or they 404.
- **Accessibility.** One `h1` per page; the demo control is a real button with a focus ring and an accessible name; tables keep their header cells; the icon is decoration and takes no accessible name; nothing depends on JS to be readable.

## 7. Assets

- **Demo GIFs**: copied from upstream at the pinned SHA into `public/pictures/projects/med-research-mcp/`, one per locale. Self-hosted, because that is the reason the page exists.
- **Poster frames**: not used. The demo autoplays, so there is no gated state to poster for.
- **Skill icon**: `public/pictures/med-research-skills.svg`, already added. Facts: `viewBox` 62×62, two stroke-only paths, `stroke-width` 5, round caps, no background, and **two different greens** (`#20c7b5` and `#22c7b5`) which should be unified. It uses `currentColor`-friendly strokes, so recolouring is a one-attribute change if the implementer wants it in site ink.
- **OG image**: `public/og/med-research-mcp.jpg`, 1200×630, JPEG because unfurlers do not render WebP. This is the asset people actually see when the link is shared, so it gets real design.

## 8. Metadata

`pageMetadata({ route, locale, title, description, image })` and `projectPageSchema`, both already in the repo. Title `med-research-mcp`. Description: one sentence, factual, no adjectives. Verify both locales land in `out/sitemap.xml` and that each page's canonical points at itself, not at GitHub.

## 9. Acceptance

Build and content:

```bash
npm run lint
npm run build

test -f out/projects/med-research-mcp/index.html
test -f out/zh/projects/med-research-mcp/index.html
grep -c "projects/med-research-mcp" out/sitemap.xml                    # > 0

# README transforms landed
grep -c "shields.io"                out/projects/med-research-mcp/index.html   # 0
grep -c "docs/media"                out/projects/med-research-mcp/index.html   # 0
grep -c "<table"                    out/projects/med-research-mcp/index.html   # > 0
grep -c 'id="install"'              out/projects/med-research-mcp/index.html   # > 0
grep -c 'id="medical-disclaimer"'   out/projects/med-research-mcp/index.html   # > 0

# no third-party asset hosts anywhere in the page
grep -oE 'src="https?://[^"]+' out/projects/med-research-mcp/index.html       # empty

# demo autoplays, so it is in the initial payload on purpose
grep -c "med-research-mcp-demo"     out/projects/med-research-mcp/index.html  # >= 1

# skill downloads
for f in med-research med-research-ebm med-research-setup; do
  test -f "public/downloads/$f.md" || echo "MISSING $f"
done
head -1 public/downloads/med-research.md   # --- (frontmatter intact, no provenance line)

# determinism
node scripts/sync-project.mjs && git diff --stat -- public/downloads src/app/content/projects   # empty
```

Manual:

- Light and dark, 1280 and 390, via CDP `Emulation.setDeviceMetricsOverride` (headless `--window-size` does not map to CSS px). Dark needs `--force-dark-mode` on this Chrome build.
- Tables scroll inside their container at 390 without widening the page.
- ZH page: no tofu, correct language attributes, anchors still resolve.
- Keyboard only: tab to the demo control, activate it, reach every download, open and close each skill.
- Network panel: initial load touches `emilkrebs.dev` only; the GIF arrives on activation.

## 10. Risks

- Upstream drift. Intended, but only safe with `--check` in CI from day one.
- `rehype-raw` widens what the renderer accepts. Acceptable only because the input is a vendored copy of your own repo: never point it at a URL, a PR branch or a fork.
- 3.3 MB GIF on click is a real cost on mobile data; a poster and an honest label mitigate it.
- Duplicate text with GitHub. Accepted: ranking is not the goal. Do not add a canonical pointing at GitHub, which would deindex the page and defeat it.
- The ZH README says 四个数据库 while naming three sources in one sentence. Fix upstream, not in the vendored copy.

## 11. Decisions

Implementer's, no approval needed: layout, typography scale, card composition, the exact play affordance, whether the Install section stays inline or collapses to the one-liner, section order within the README body, the wording of labels, the OG composition.

Worth confirming before merge, because they are hard to reverse once shared: the slug (`/projects/med-research-mcp/`). The demo's behaviour is settled: it autoplays, and `DESIGN.md` carries it as a scoped exception.

## 12. Order of work

1. `ROUTES` entry plus two pages that render only head and metadata; confirm canonical, hreflang and sitemap.
2. `scripts/sync-project.mjs` with `--check` and the markdown downloads; commit the vendored content.
3. README renderer; build; run the transform checks.
4. Demo, per whichever behaviour §6 resolved.
5. Skills: cards, per-skill markdown download, read-in-place.
6. Head, outbound links, provenance line.
7. OG image, metadata, JSON-LD.
8. Landing card `href`.
9. `DESIGN.md` amendments.
10. Full acceptance pass and screenshots.