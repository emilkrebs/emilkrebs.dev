# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and engineers at developer-tools companies, open-source maintainers, and collaborators who want to build or evaluate security-minded developer tooling. Their job on the site: in under thirty seconds, understand who Emil Krebs is, what he builds, and why it matters, then decide whether to hire, collaborate, or reach out.

## Product Purpose

Make Emil's identity legible in one committed statement: he is a Software engineer who builds the tools that build software (LSP, Langium, DSLs), he takes privacy seriously (VailNote, WatchLock), and he ships his work open source. Success is a visitor leaving with one idea - "this is the language-engineering, open-source, security-minded builder" - rather than a generic "full-stack developer" impression.

## Positioning

Most developer portfolios claim broad full-stack competence. This site claims the narrower, more defensible lane: Software engineering (language servers, DSLs, code tooling) plus real products built on that craft - Prami, a spaced-repetition learning app in public preview, and Healthstack, a specialized IDE for health optimization with its own purpose-built DSL. Around them sit a consistent security and privacy streak (VailNote zero-knowledge encryption, WatchLock) and open-source citizenship (Langium showcase, BIPoC Climate Justice conference site). The position no neighboring portfolio can truthfully copy: "builds the tools that read, understand, and transform code - language servers, IDEs, DSLs - and ships real products open source."

## Operating Context

Static-exported site built with Next.js 15, TypeScript, and Tailwind CSS v4, deployed to GitHub Pages via GitHub Actions. Content is hand-edited source; no CMS. SimpleAnalytics for traffic. Performance is part of the identity: the site must stay a static export with no runtime framework bloat.

## Capabilities and Constraints

- Single landing page with sections: Field (who he is), What I do (strengths), Work (TypeFox), Projects, Colophon.
- German legal pages must remain: imprint (`/imprint`) and privacy (`/privacy`).
- Existing SEO and OpenGraph metadata must be preserved and updated (title, description, OG image).
- Contact surface: email, GitHub, LinkedIn. Social links stay plain and quiet.
- WatchLock tester call (Android 11+ / WearOS 3+): currently a loud notification; redesign moves it to a sober row in Projects with a plain link to the tester signup.
- Resume download (PDF) exists today; keep it available, restyle as a plain link.
- No dark mode in the redesign: paper/ink is light only, a deliberate commitment. Revisit only if evidence demands it.

## Brand Commitments

- Name: Emil Krebs. Domain: emilkrebs.dev. Home: Kiel, Germany. Employer: TypeFox GmbH (Software engineering, LSP, Langium).
- Voice: dry, direct, factual, no hype, no emoji, no exclamation marks. Northern-German, engineering-first.
- The cooking status, binding: the hero carries a mono line "Cooking: <real, current projects>" that mirrors Emil's GitHub status (currently "Cooking..."). It is content, not decoration: it lists only projects that are genuinely being worked on, and it is removed - never faked - when nothing qualifies.
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
3. Speed is part of the identity: static export, no framework runtime, measurable performance.
4. No hype: sober, factual, dry; the tone itself is the brand.
5. The site demonstrates the craft: hand-typed code, disciplined typography, a committed visual system with no AI tells.

## Accessibility & Inclusion

- Legal: German imprint (Impressum) required.
- WCAG AA contrast on the paper/ink palette; keyboard-navigable; no motion to speak of, so prefers-reduced-motion is trivially honored.
