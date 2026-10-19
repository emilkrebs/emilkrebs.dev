# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and engineers at developer-tools companies, open-source maintainers, and collaborators who want to build or evaluate security-minded developer tooling. Their job on the site: in under thirty seconds, understand who Emil Krebs is, what he builds, and why it matters, then decide whether to hire, collaborate, or reach out.

## Product Purpose

Improve Emil's general image as a software engineer, for networking and job search, without narrowing it to the language-engineering niche. The specialized, complex work (language servers, Langium DSLs, Theia IDEs, upstream Eclipse Langium contributions) is the proof of depth, not the boundary of the profile: software that has to understand other software is hard, and Emil builds it. Success is a visitor leaving with one idea - "a capable software engineer who handles complex systems, and here is the public proof" - rather than a generic "full-stack developer" impression. The public title stays "Software engineer" (owner decision, 2026-10-19).

## Positioning

Most developer portfolios claim broad full-stack competence. This site claims the narrower, more defensible lane: Software engineering (language servers, DSLs, code tooling) plus real products built on that craft - Prami, a spaced-repetition learning app in public preview, and Healthstack, a specialized IDE for lifestyle optimization with its own purpose-built DSL. Around them sit a consistent security and privacy streak (VailNote zero-knowledge encryption, WatchLock) and open-source citizenship (Langium showcase, BIPoC Climate Justice conference site). The position no neighboring portfolio can truthfully copy: "builds the tools that read, understand, and transform code - language servers, IDEs, DSLs - and ships real products open source."

## Operating Context

Static-exported site built with Next.js 16, TypeScript, and Tailwind CSS v4, deployed to GitHub Pages (behind Cloudflare) via GitHub Actions. Content is hand-edited source; no CMS. SimpleAnalytics for traffic. Performance is part of the identity: the site must stay a static export. Client JavaScript is the Next.js/React runtime (about 140 KB gzipped per page) plus three small client components; nothing beyond that ships without a reason.

## Capabilities and Constraints

- Single landing page with sections: Field (who he is), What I do (strengths), Work (TypeFox), Projects, Contact (one line of intent and the visible address), Colophon.
- German legal pages must remain: imprint (`/imprint`) and privacy (`/privacy`).
- Existing SEO and OpenGraph metadata must be preserved and updated (title, description, OG image).
- Contact surface: email, GitHub, LinkedIn. Social links stay plain and quiet.
- WatchLock tester call (Android 11+ / WearOS 3+): currently a loud notification; redesign moves it to a sober row in Projects with a plain link to the tester signup.
- Resume download (PDF) exists today; keep it available, restyle as a plain link.
- Dark mode follows the system setting (`prefers-color-scheme`); paper/ink stays the primary, light scheme.

## Brand Commitments

- Name: Emil Krebs. Domain: emilkrebs.dev. Home: Kiel, Germany. Employer: TypeFox GmbH (Software engineering, LSP, Langium).
- Voice: dry, direct, factual, no hype, no emoji, no exclamation marks. Northern-German, engineering-first.
- The hero identity, binding: the portrait plate keeps its "Thinking..." chip and green face-reticle (see DESIGN.md photo-plate). Owner decision, 2026-10-19: the playful touch stays because it says there is a human behind the page, which matters in the AI era. It replaces the earlier "Cooking:" line of current projects.
- Anti-references, binding: AI-purple gradients, glassmorphism, pulsing status dots, floating profile picture, tech-icon walls, emoji CTAs, "Hi there!" greetings, three-equal-card rows, generic template hero.
- Photography, binding: the site shows a real, unretouched photograph of Emil as a small duotone ID plate in the hero (spec-sheet identity record). No stock photos, no AI portraits, no decorated avatar styling. Casual-but-professional register (the same as his everyday profile pictures), head-and-shoulders, natural light. Until the photo is supplied, the shipped placeholder is `public/pictures/photo-plate.svg`; the component is final, only the asset swaps.

## Evidence on Hand

- Full public source of the incumbent site in this repository (src/app): About, Technologies, Projects sections, resume.pdf, imprint and privacy pages, favicon and OpenGraph assets.
- Real project list with working links: WatchLock (Android/WearOS), VailNote (encrypted note sharing), Langium Showcase, BIPoC Climate Justice Conference site.
- Real performance evidence: PageSpeed results referenced in README.md.
- Analytics: SimpleAnalytics script tag in the root layout.

## Product Principles

1. One idea per page: Software engineering, open source, security - nothing else.
2. Proof over claims: every strength statement points at one concrete artifact.
3. Speed is part of the identity: static export, minimal client JavaScript, measurable performance.
4. No hype: sober, factual, dry; the tone itself is the brand.
5. The site demonstrates the craft: hand-typed code, disciplined typography, a committed visual system with no AI tells.

## Accessibility & Inclusion

- Legal: German imprint (Impressum) required.
- WCAG AA contrast on the paper/ink palette; keyboard-navigable; no motion to speak of, so prefers-reduced-motion is trivially honored.
