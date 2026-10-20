---
name: emil.krebs() - a language specification
description: A personal website set like a printed language specification
colors:
  paper: "#f7f5f0"
  paper-deep: "#ece8df"
  ink: "#141310"
  ink-soft: "#6e6a63"
  signal: "#e8450c"
  hairline: "rgba(20, 19, 16, 0.14)"
colors-dark:
  paper: "#141310"
  paper-deep: "#1c1915"
  ink: "#f7f5f0"
  ink-soft: "#9b968c"
  signal: "#e8450c"
  hairline: "rgba(247, 245, 240, 0.14)"
typography:
  display:
    fontFamily: "Schibsted Grotesk, sans-serif"
    fontSize: "clamp(3rem, 8vw, 6.5rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Schibsted Grotesk, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Schibsted Grotesk, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.08em"
    textTransform: "uppercase"
  accent:
    fontFamily: "Instrument Serif, serif"
    fontStyle: "italic"
    fontWeight: 400
rounded:
  none: "0px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "48px"
  xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "16px 28px"
    typography: label
  button-primary-hover:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "16px 28px"
    typography: label
  link-arrow:
    textColor: "{colors.ink}"
    typography: body
  tag:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.none}"
    padding: "4px 8px"
    typography: label
  project-card:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  token-mark:
    backgroundColor: "{colors.signal}"
    width: "6px"
    height: "6px"
  photo-plate:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
  product-plate:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    border: "1px solid {colors.hairline}"
  status-label:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.signal}"
    rounded: "{rounded.none}"
    padding: "4px 10px"
    typography: label
---

## Overview

**Creative North Star: "The Spec Sheet."** The site reads like a printed language specification: warm paper, black ink, one signal accent, monospace labels for everything that is metadata. Emil builds tools that read, understand, and transform code, so his own site is structured like a grammar. The metaphor lives in the structure (a document, sectioned like a spec) and in one quiet motif (a row of small square tokens, like syntax tokens, marking the end of the hero and the footer). No interface chrome, no fake product mockups, no screenshots of code.

The emotional register is northern, dry, and confident: a Kiel harbor ferry timetable set by a Swiss typographer. Every element earns its place; nothing floats, pulses, or glows.

**Anti-reference (binding):** the incumbent design. Dark purple-blue gradient background, gradient text, glassmorphism cards, pulsing status dot, floating avatar with bounce, emoji CTAs, icon-tile walls, rounded tag pills. None of it returns.

## Colors

- **Paper** `#f7f5f0` - the page surface. Warm off-white, never pure white. The light scheme is the reference; the dark variant below inverts paper and ink.
- **Paper-deep** `#ece8df` - card and block surfaces that need to sit one step below paper.
- **Ink** `#141310` - all text, all primary buttons. Near-black with a warm cast, never pure black.
- **Ink-soft** `#5f5b55` - labels, metadata, secondary text. AA on both paper and paper-deep (4.4:1 at the previous value was one step too soft; this is the smallest visible nudge that clears 4.5:1).
- **Signal** `#e8450c` - the only accent in the system. International orange. Used for: the token marks, the arrow after links, the hover state of the primary button. One accent, everywhere, nowhere else.
- **Signal-accent** `#22c55e` - the gimmick green: the single locked exception to the one-accent rule, used only by the hero face-reticle and the Thinking chip border, so the portrait reads as a tracked subject. Never on text, never outside the hero.
- **Hairline** `rgba(20,19,16,0.14)` - 1px borders that separate spec sections and card edges.

Rules: exactly one accent in the system; signal-accent is the one locked exception (hero reticle and chip border only). No gradients anywhere, no shadows, no translucent overlays. Text is ink on paper at WCAG AA contrast or better; signal is reserved for marks and hover, never for large text. All rules hold in both color schemes.

### Dark variant

The same document at night. The visitor's `prefers-color-scheme` decides; there is no toggle, and no section ever inverts on its own. Tokens swap, the grammar does not: layout, type roles, hairlines, plates, captions, and the zero-radius rule are identical in both schemes.

- **Paper** `#141310` - the light ink becomes the night paper: warm near-black, never pure black.
- **Paper-deep** `#1c1915` - card and plate surfaces, one warm step above paper.
- **Ink** `#f7f5f0` - the light paper becomes the night ink: warm off-white, never pure white.
- **Ink-soft** `#9b968c` - labels and metadata; AA on paper and on paper-deep.
- **Signal** `#e8450c` - unchanged. One accent in both schemes; 4.7:1 on night paper.
- **Signal-accent** `#22c55e` - unchanged at night; the reticle keeps its hue on night paper.
- **Hairline** `rgba(247,245,240,0.14)` - the same 1px line, inverted cast.

Rules: no gradients, no shadows, no blur, no rounding in dark either; the page stays flat in both schemes. The duotone portrait inverts its blends (image screen instead of multiply, lift multiply instead of screen) so the plate prints paper-and-ink at night as it does by day. Product screenshots, live previews, and the playground stay full color in both schemes: evidence is not recolored. Primary buttons invert with the tokens (light ink ground, night paper text), keeping the ink-to-signal hover in both schemes.

## Typography

Two families, three roles:

- **Display** - Schibsted Grotesk 700, tight: `clamp(3rem, 8vw, 6.5rem)`, line-height 0.95, tracking `-0.03em`. Used only for the name in the hero. Renders like a wordmark, not a heading.
- **Headline** - Schibsted Grotesk 600, `clamp(1.75rem, 3vw, 2.5rem)`, line-height 1.1. Section titles. Uppercase is allowed for section titles, with normal spacing (no letterspaced caps).
- **Body** - Schibsted Grotesk 400, 1.0625rem, line-height 1.6. All prose. At most 70 characters per line.
- **Label** - IBM Plex Mono 500, 0.75rem, tracking 0.08em, uppercase. Reserved for metadata: navigation, dates, stack tags, the colophon, the small "language specification" credit. Never used for headlines or decoration strips.
- **Accent** - Instrument Serif italic. Exactly one word or short phrase per section, inside otherwise body-set prose, to give the emotional line emphasis ("open source", "privacy"). One per section at most. Never in the hero headline itself.

Rules: no em dashes or en dashes anywhere, use hyphens or restructure. No fake lowercase "hacker" styling, no all-caps headlines, no mono-caps decorative strips at the bottom of the hero. If a typeface is not in the list, it is not on the page.

## Layout

Single page, one column at desktop width capped at 1120px, generous vertical rhythm (spacing scale: xs 8 / sm 16 / md 24 / lg 48 / xl 96).

Section order: nav, hero, Field, What I do, Work, Projects, Contact, Colophon footer. Each section is separated by lg to xl whitespace, not by cards or background changes; the paper stays continuous and the hairline only appears where the spec needs it.

- **Hero:** name at display size on one or two lines, one body-size line under it carrying the title and the claim ("Software engineer at TypeFox in Kiel, Germany. I build language servers and IDEs: software that has to understand other software."), then the three plain link CTAs (GitHub, LinkedIn, Email). On mobile the name, claim, and CTAs come first and the portrait plate follows them. Beside them, the portrait plate carries the site's one gimmick: a status chip pinned to the plate's top-right corner carrying the mono line "Thinking..." (paper ground, ink-soft mono text, signal-accent hairline border) and, over the face, the green face-reticle (specified under photo-plate). The chip line is content, not ornament, and always honest: the portrait is always thinking; it is never replaced by a fake status dot. Fits the initial viewport. No scroll cue, no decorative strip.
- **What I do:** four full-width rows (Developer tooling, Products and frontend, Security & privacy, Open source), each with a headline on the left and one or two sentences of proof on the right that name concrete artifacts. Plain labels, no numeric prefixes, no links in the rows.
- **Projects:** two flagship cards lead (Prami, Healthstack), full-width or 8-col each, the largest type and the only cards allowed to carry a status-label (Prami: "PREVIEW", Healthstack: "PREVIEW"). Each flagship card opens with a 16:10 product plate (see product-plate) above the name. Prami's card previews the live app; Healthstack's card opens its own page (`/healthstack`, see Pages) because it is not publicly hosted yet. Healthstack's plate is a real screenshot of the running .bio playground (captioned "Live - emilkrebs.dev/playground"), never a logo laid over a blurred image. Below them, the secondary projects (Langium Showcase first, as the most on-thesis proof, then VailNote, WatchLock, BIPoC Climate Justice site, this site) in the asymmetric grid: 12 columns, cards alternate wide (8 col) and narrow (4 col) on desktop, stacking on mobile. Cards are paper-deep blocks with a hairline border, never rows with top and bottom borders. Secondary cards carry a plate too: a real, unfiltered screenshot of the running product, otherwise the labeled placeholder plate. A third-party showcase may add a consent-gated live preview on top of its screenshot (see product-plate). Every card's link names its destination ("Open vailnote.com", "Source on GitHub"), and its accessible name includes the project name.
- **Contact:** the last section before the colophon. One line of intent in body-large ("For roles, collaborations, or questions about anything on this page, write to me.") and the email address itself, set at headline size as a selectable mailto link-arrow. No form, no button, no social icon row: the footer already carries the other exits. The plate sits above the name on every project card, so every project card opens the same way.
- **Colophon:** a small mono line: name, Kiel, the link list, and the copyright. The token-mark row ends the page.

Responsive: mobile is the same document at one column, hero at 3rem minimum. Navigation collapses to name plus links at reduced density (tighter gaps and label tracking below 640px). The one exception: the Contact anchor hides below 640px, where the hero's Email link and the closing Contact section already cover it.

## Pages

The site is one page plus the subpages it needs; nothing else gets a page without a reason.

- **Imprint / Privacy:** markdown-rendered legal pages. Mono back link ("← Back to home") on top, max-width 3xl, light markdown styles (ink text, signal underline links, mono code chips).
- **/story (personal story):** a timeline page in the same document grammar: H1, lead, thesis, token mark, then one era per chapter (Era headers with period + title, mono section markers), project cards per era (see project-card / confidential-card below), a closing pull quote. Compact card grids (3-across square stamp plates, no captions) group relic-era projects; full cards carry plates and Live captions. Era placement rule: origin era + status badge ("Active"/"Preview"/"Concept") + the Today roll-call names everything alive. Customer work under NDA renders as confidential-card placeholders — never invented clients, never implied claims. Events render as an event-list (see below) inside the era they happened in, not as their own chapter, so a recurring event (Waterkant, every June since 2022) threads through the eras one edition at a time. The role tag uses conference-badge words and says exactly what happened: "Attendee" / "参会者" for attendance, never dressed up as participation, "Speaker" / "演讲者" only for a talk actually given. Rows carry no photo. An event earns its own detail page only once there is substance to put on it (a talk, a pitch, a concrete outcome).
- **/healthstack (product page):** the only product page, and the one page that carries real product imagery. Same document grammar as the homepage: max 1120px, hairline section separators, mono section headings, one status-label ("PREVIEW - DEV BUILD") beside the hero claim. Built on the product's own messaging (the Healthstack deck): a hero claim with tag row and the biomarker dashboard plate, then one section per capability (Timeline, Protocol builder, Biomarker tracker, Trends, AI agents), two headlines carrying the serif italic accent as bookends (Timeline and AI agents), the rest set plain, a proof sentence, a spec-style stat table (hairline cells, mono values and labels), and a screenshot plate below. Screenshots are the real dev build, taken from the app; they arrive letterboxed into 16:10 (the source shots are more panoramic; the bars are paper-deep so the full shot survives) and render full color, unfiltered. A capability without a real shot yet carries the shared pending placeholder plate, never an empty frame. The hero claim carries no serif accent: the accent rule ("never in the hero headline itself") holds on this page as everywhere. The DSL section carries the live editor: the playground embedded same-origin (see /playground below) opened on `type-system.bio` — the language is shown running, not quoted, and there is no static excerpt block. The Status section states build state plainly: screenshots are real, a public preview is not hosted yet, no roadmaps, no dates, no promises. The Healthstack card on the homepage opens this page until a public preview exists; when one does, the card may grow a live first-party preview and the page's Status section names it.
- **/playground (DSL playground):** a separate Vite static app that builds into `public/playground/` and ships with the site through the root build chain (`build:playground` runs before the Next export). Served same-origin and embedded on /healthstack as a first-party direct-load iframe, lazy-loaded, full color, no consent gate: the language server, the validator, the curated library and the interaction catalog run entirely in the visitor's browser, and no data leaves it (the grammar engine ships with the page). The embed opens on `?sample=type-system`; the standalone page defaults to the same sample, with `basic-supplements`, `sleep-optimization` and `interaction-check` one click away. DSL sources are vendored from the biohacking-ide language package via `playground/sync-dsl.sh`; `playground/src/lang` and `playground/src/samples` are generated output, never edited by hand, re-synced with `npm --prefix playground run sync-dsl`.

## Localization

English is the default and fallback language at `/`. zh-CN variants of the landing page and the story live at `/zh/` and `/zh/story/`; all other pages remain English, and links from the Chinese pages to them fall back to the English pages (the footer keeps its English labels for the same reason, but its Story link follows the locale). Chinese text keeps the same type roles and layout; no Latin webfont carries Chinese, so zh renders through system CJK fallbacks (PingFang SC, Hiragino Sans GB, Noto Sans SC / CJK SC, Microsoft YaHei) listed right after the Latin webfont in the font stacks. A zh-scoped block in `globals.css` (`html:lang(zh)`) adjusts three things: the signal accent becomes a Chinese vermilion (`#c8102e` on paper, `#f04438` at night, both AA; red is the auspicious colour and the English orange sits close to it), line height opens to 1.75-1.8 for body and 1.3 for headlines, and tracking is eased (labels 0.04em instead of 0.08em, body 0.02em, negative heading tracking removed) because wide or negative tracking distorts full-width glyphs. Captions and status labels are translated per locale ("Live - <origin>" / "在线 - <origin>", "Preview" / "预览", "Concept" / "概念"), while origins, product names, stack tags, and URLs stay verbatim in both locales. Type scale and spacing are otherwise unchanged for zh: the spec sheet tolerates the denser text.

**Copy storage:** all localized UI copy (nav, hero, field, strengths, projects, consent and external notices, JSON-LD strings, footer, back header, story chrome) lives in `src/app/lib/i18n/{en,zh}.json` and is loaded through `src/app/lib/i18n`, which re-exports the typed bundles; English remains the reference locale. The story prose itself is one MDX file per locale (`src/app/content/story.mdx`, `story.zh.mdx`); the story components in `src/app/components/story.tsx` are bound per locale (`storyComponents.zh`) and passed to the localized MDX as its `components` prop. Chinese prose keeps each paragraph on one source line (a line break between two CJK characters renders as a stray space), and the serif accent is set upright in zh: CJK has no true italic. The design-intent HTML comments that were once embedded in both layouts' markup (THESIS/OWN-WORLD/STORY/...) were removed from the layouts on 2026-08-25 (user decision): this document, not the shipped HTML, is the home of the design intent.

**Auto-redirect:** a visitor whose primary browser language is Chinese (zh-*) and who lands on `/` is redirected client-side to `/zh/` (inline script in the English layout head, so it runs before first paint; it fires only on the landing route, never on subpages). Navigating within the site (a same-origin referrer) never triggers it — "Back to home" on an English page stays English. Nothing is stored: the site keeps no memory of a past choice, so a visitor whose browser still reports Chinese first is redirected again on their next fresh visit even after picking English once. This is a deliberate trade-off for carrying no client-side storage at all (see Localization > Copy storage: no cookies, no local storage, nothing to disclose or consent to) — the cost is that "get me back to English" isn't remembered, only ever decided fresh from the browser's current language.

### Chinese ornamental layer (mock)

**Status: proposal, not shipped.** A visual mock in `globals.css`, active only under `html:lang(zh)`, hooked by three class names: `.page-title` on the MDX h1, and `.story-timeline` and `.pull-quote` in `story.tsx`. The zh pages may carry one step more ornament than the English spec sheet, in the register of a printed Chinese document. Each texture has one meaning, by day and at night. On the story, ornament bookends the page: clouds at the title, the rubbing at the closing quote, and one meander strip as the break between the contents table and the timeline. The timeline itself stays plain, so the hairline rail and its red seals carry the structure; a patterned rail and crackle on every showcase card buried it. The tiles are generated and live in `public/pictures/zh-textures/`; five are used, one is rejected:

- **宣纸 xuanzhi** — the paper itself: handmade-paper fibre (pro pack). Light mode only, as the body background. The tile is mean-normalized to `#f7f5f0`, high-passed to remove large blotches, and mirror-tiled to 2048px so it repeats without a seam. Night paper stays flat.
- **云纹 yunwen** — the title: cloud scroll as a watermark behind each page's title, the hero name on the landing and 我的故事 on the story (ink-on-transparent at 20% alpha, so it survives the paper grain; paper-on-transparent at 12% at night). Masked away before the copy below and to the right, with a soft left edge so wide viewports never show a cut column of cloud. It reads as a watermark, not wallpaper.
- **回纹 huiwen** — the divider: meander (pro pack). A 12px `repeat-x` strip. On the landing, in place of every section hairline below the hero; the hairline goes transparent under it, since it struck through the frets. On the story, once, centred in the gap between the contents table and the timeline. 65% opacity, 50% inverted at night. The strip is centred and fades at both ends so no fret is cut mid-cell, and the tile is cropped before its closing box border so repeats share one border instead of doubling it. The strip is alpha, not a paper rectangle, so only the key-fret ink prints.
- **冰裂纹 binglie** — the work: crackle glaze on the paper-deep surfaces of the landing's project cards (`#projects`). The story's showcase cards stay flat: there are dozens of them, and crackle on each is noise. Ink lines at 9% alpha by day, light lines at 13% at night. No blend mode and no negative z-index.
- **碑拓 tapian** — inscription: stone rubbing behind the story's pull quote, a sheet from the quote's signal rule to a faded right edge, 1.5rem above and below with a 6px feather. By day it is an ink rubbing (ink on paper, the stone's veins left bare, 3–35% ink); at night it is the stone tile at 43% alpha. At night the stone also runs as a 40px band just under the footer hairline, centred on the footer's 1120px column with both ends faded, ending inside the footer's 64px top padding before any footer copy.
- **窗棂 chuangling** — lattice: rejected, too busy, and the frame is baked into the tile.

Pack mix: 宣纸 and 回纹 come from `qwen-image-3.0-pro`; 云纹, 冰裂 and 碑拓 stay on `qwen-image-3.0`. The pro paper grain is denser and the pro meander is a true single strip; the standard pack's crackle and stone are quieter on dark surfaces. Day variants are derived from these tiles, never regenerated: `-ink` tiles are the same alpha re-tinted to ink (the rubbing maps stone luminance to ink density, at 512px), and the day cloud tile is the ink tile at doubled alpha.

Discipline: ornament lives at edges, dividers, watermarks, low-contrast surface grain, and the one inscription. No layer intercepts pointer events, adds layout or horizontal scroll, or animates. Text contrast: the footer stone stops before the footer copy; the pull quote stays above 7:1 on the rubbing by day and above 9:1 on the stone at night; the day crackle is capped at 9% so ink-soft tags hold 4.5:1 where a line crosses them. The night crackle's 13% lets those tags dip to about 4.1:1 at a crossing. The token-mark remains the page's only standing mark; these textures are a zh-only proposal layered beside that rule, not a change to it.

**Language switcher:** a bordered tag in the nav grammar (hairline border, 0px corners, mono, ink-soft, hover ink) so it reads as an action distinct from nav links. On the Chinese pages (`/zh/`, `/zh/story/`) it is always visible, labeled EN, and returns to the English counterpart (`/zh/` to `/`, `/zh/story/` to `/story/`, where it sits at the right end of the back header) — a Chinese reader should always have a way back. On the English pages it switches forward to zh (labeled 中文), but stays hidden by default: showing it to every English visitor regardless of whether they read Chinese would read as noise, or confuse readers into thinking the page has a Chinese-only feature. It only reveals itself (`data-zh-reader` on `<html>`, read by the `zh-reader:` variant) to a visitor whose browser's current primary language is Chinese — the same, purely live check the auto-redirect above uses, so the switcher only ever appears to people who can use it.

## Elevation & Depth

The page is flat. No shadows, no blur, no translucency, no layering. Depth is communicated exclusively by the paper / paper-deep step and by 1px hairlines. The hover state of the primary button is a color change (ink to signal), not a lift. This is a statement: a spec sheet does not float.

## Shapes

All corners are 0px, everywhere. Cards, buttons, tags, the token marks: square. The only "rounding" in the system is typographic (the italic serif accent and the circular letterforms of the typeface). Radius stays uniform so the page reads as one object; there is exactly one radius value in the system and it is zero.

## Components

- **button-primary:** ink background, paper text, 0px corners, label typography, 16px 28px padding. Hover: signal background. Used at most twice on the page (projects link, tester signup). If a call to action needs a third instance, the design is wrong.
- **link-arrow:** body typography, ink, with a signal arrow glyph after the text. The standard way to exit the page: GitHub, LinkedIn, project links, email.
- **tag:** paper background, ink-soft label text, 0px corners, hairline border, 4px 8px padding. Mono, uppercase, no `#` prefix, no pill shape. Stack tags on project cards only.
- **project-card:** paper-deep block, hairline border, 0px corners, md padding. Contains: project name (headline), one sentence (body), stack tags, arrow link. Hover: hairline becomes ink; no scale, no glow.
- **confidential-card:** the project-card grammar, redacted: dashed hairline border (ink/35, ink/70 on hover) instead of the solid hairline, a subtle dotted texture (16px radial-dot grid, ~25% opacity) behind a paper-deep plate area reading "Details hidden due to active NDA restrictions." in ink, and dashed tag/label borders. No image, no link: the card's action line reads "Private". Used only for real NDA-bound client work on /story — the frame never lies, and a hidden project is shown as hidden.
- **event-list:** events are minor stops on the /story timeline, set quieter than anything around them so the chapter still reads calmly: no frame, no header, no bordered tags, no arrows. One text line per event: a date column (mono, ink-soft, fixed width so names align), the event name (body at small size, ink, signal on hover when it links to the event's site), then city and role as one mono ink-soft run ("KIEL · ATTENDEE"). Each line carries a 7px hollow square (ink-soft hairline on paper) sitting on the timeline rail, smaller and quieter than the filled signal square of an era. On mobile a long line wraps under the name, never under the date. Dates are month precision, authored per locale: "Jun 2022" in en, "2022年6月" in zh (no spaces inside CJK dates: mono tracking turns them into gaps); when only an age is known, the date column states the age ("Age 15" / "15岁"), in the same register as the era periods. No images, no logos: the line is a record, not a gallery.
- **token-mark:** a 6px signal square, repeated at even spacing in one row of up to 16, used as a closing mark under the hero and in the colophon. It is the only decoration on the page; it is a simple geometric mark, never animated, never assembled into a logo.
- **photo-plate:** the real, unretouched portrait of Emil, rendered in duotone (paper and ink only, signal allowed as the midtone) so it stays inside the palette lock. The portrait is the only image on the site that gets color treatment; it is an identity object, and identity is printed, not shown. Placed in the hero as a small identification plate: 0px corners, hairline border, four corner crop marks (ink-soft L marks, like print registration ticks, sitting just outside the frame). The photo is a document object, not a decorated avatar: no rounding, no glow, no background bleed. One plate in the hero; a second documentary photo is allowed in the Field section only if it arrives duotone and hairline-framed. The plate carries the site's single gimmick, the face-reticle: a green hairline box (signal-accent at 70% opacity, fading to 5% on hover) centered on the face, the kind of box a face-detection demo draws around a tracked subject. Inside the reticle the duotone blend deepens (tint and lift); outside it, the plate stays flat grayscale. On hover the whole plate reveals natural color and the reticle border fades to near-invisible: the scan releases. The reticle is decorative (aria-hidden), static, and locked to this plate: it appears nowhere else, and no other element may use signal-accent.
  - **Image required (pending):** one portrait, casual but professional (the same register as Emil's WhatsApp profile picture): head-and-shoulders, centered, looking at camera, natural daylight, neutral or softly blurred background, no studio flash, no busy backdrop. Minimum 1200px on the long side, 1:1 or 4:3, WebP or JPEG. Duotone is applied at build, so background color is irrelevant.
  - **Placeholder until supplied:** the real asset now ships as `public/pictures/portrait.webp` (512x512 WebP, duotone at build). Swap the asset, never change the component.
- **product-plate:** a real screenshot of a product, shown exactly as it is: full color, 16:10, hairline border, 0px corners, mono caption under the plate naming the live origin ("Live - vailnote.com") or the honest pending state ("Screenshot pending"). Placed at the top of the project card, above the name. No duotone, no filter, no overlays on product imagery: a screenshot is evidence, and evidence is not recolored. The plate frame and caption are what make it part of the document. Never rounded, never floating, never a mockup built from divs.
  - **Live preview (secondary cards):** instead of a screenshot, a card may carry a real iframe of the running product, 16:10, hairline border, mono caption naming the origin ("Live - langium.org/showcase/minilogo"). Lazy-loaded, `referrerPolicy="no-referrer"`. Live previews are full color, no duotone, no filter: the product shown as it is. Point the frame at the most impressive page of the product, not the landing menu. Only for sites verified to permit framing (no `X-Frame-Options` / `frame-ancestors` blocking, checked by header). If a site blocks framing, it gets the placeholder plate instead; the frame never lies, and never shows a blocked page.
  - **Consent-gated previews:** when a third-party preview loads a site with its own scripts, the plate shows the page's real, unfiltered screenshot, and a small solid paper panel on it carries a mono notice ("The preview loads a third-party site with its own scripts") and a Load preview button (button-primary). The iframe is created only on click, so nothing is requested from the third party before the visitor agrees; then the live page fades in over the screenshot. The Langium Showcase card uses this: the card links to langium.org/showcase, the preview opens MiniLogo. Until a product is publicly hosted, it does not get a preview: it gets a placeholder plate or its own page.
- **dialog:** the testing notice and the WeChat card share one behaviour (src/app/components/use-modal.ts): focus moves in, Tab and Shift+Tab stay inside, Escape closes, focus returns to the trigger. The scrim is an opaque paper-deep layer, never a blur or a translucent ink wash: a document does not frost.
  - **Placeholder until supplied:** pending screenshots render through the shared `PlaceholderPlate` component (`src/app/components/placeholder-plate.tsx`): the same plate grammar (hairline frame, ink skeleton bars, one signal token, "SCREENSHOT PENDING" and the plate's name in mono), driven by token colors so it follows both schemes. Any project card or feature section with `placeholder: "<name>"` in its data gets it; the component is final, and a real screenshot replaces it by pointing the data at the image, never by restyling the skeleton per instance.
- **status-label:** a mono uppercase text label in ink with a hairline border and one 6px signal token mark before the text, used only for real semantic states: "PREVIEW" on the Prami and Healthstack flagship cards. If a state is not real, there is no label. At most one per project card, never in the hero. (Ink text keeps the label at 17:1; signal stays reserved for marks and hover.)

## Do's and Don'ts

Do:

- Keep paper, ink, and one signal accent. Signal-accent appears only as the hero face-reticle and the Thinking chip border; nowhere else.
- Use mono labels for metadata only, and uppercase them with normal tracking.
- Use the italic serif accent once per section at most.
- Let whitespace carry the hierarchy; the layout is the design.
- Keep every fact true: employer, projects, links, location.
- Use only real photography of Emil, duotone and hairline-framed. One plate in the hero, at most one documentary photo elsewhere.
- Frame all imagery in hairline plates with mono captions: portrait in the hero, product screens in the cards and pages. Only the portrait is duotone; everything else is shown as it is.

Don't:

- No gradients, glass, blur, or shadows anywhere, on any surface, ever.
- No em dashes or en dashes in copy. Hyphens or restructured sentences only.
- No numbered section prefixes ("01", "02") above headings; name the section in plain language.
- No mono-caps decoration strips under the hero; no coordinates, weather, or time strips; no fake status dots; no scroll cues; no version footers.
- No fake product UI: no fake terminals, dashboards, or chat widgets built from divs.
- No three-equal-card rows; no icon walls; no tech-logo grid as a section.
- No hover motion beyond the two color changes defined above; no float, pulse, bounce, or parallax.
- No emoji anywhere, including the copy.
- No stock photography, no AI-generated portraits, no Unsplash imagery, no photos with rounded corners or glows. A fake or borrowed face is the one unforgivable thing on a personal site.

## Motion

One rule: the page does not move on load. The only transitions are the defined hover states (button ink to signal, card hairline to ink, the reticle border fading from 70% to 5%), instant or a single short ease-out, plus the portrait's slow duotone reveal (600ms) in the hero. `prefers-reduced-motion` is honored trivially because there is nothing to reduce.
