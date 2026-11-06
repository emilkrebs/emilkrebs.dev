# GEO answer audit

Checked: 2026-11-06 against the local production export, not the deployed site.

Each row selects one canonical answer on the page that owns it. The quotations
are rendered prose, not assembled from a card title, metadata, or JSON-LD.
Existing mentions elsewhere remain; no FAQ, facts table, or new route was added.
The owner's approved identity wording uses name, role, employer, and city without
comparing him with another person.
Quotations preserve the text in exported HTML; the story kicker keeps its existing
uppercase styling, and the identity sentence leads the body copy.

## Canonical answers

| Entity | Owning route | Sentence as rendered | Result |
| --- | --- | --- | --- |
| Emil Krebs | `/story/` | Emil Krebs is a software engineer at TypeFox in Kiel, Germany. | pass - first body paragraph; kicker unchanged |
| TypeFox work | `/` (Field) | At TypeFox I build custom VS Code extensions, language servers using the LSP, and the IDEs around them. | pass - removed the context-dependent "that means" |
| Kiel University education | `/#work` | Alongside the job, I am studying full-time for a Bachelor's in Computer Science and Sociology at Kiel University. | pass - named the institution; studies are ongoing |
| Langium Showcase / open-source contribution | `/#projects` | The Langium Showcase includes the state machine, arithmetics, MiniLogo, and domain model editors I built for langium.org. | pass - named the project in its description |
| Healthstack | `/healthstack/` | Healthstack is a specialized IDE for lifestyle optimization on Eclipse Theia: biomarker tracking, unit conversion, and a purpose-built DSL for intervention protocols. | pass - named the subject in the existing lead |
| Prami | `/#projects` | Prami is an active-recall and spaced-repetition app, engineered so the review schedule fades into the background. | pass - named the subject; the existing caption still says "In testing" |
| VailNote | `/#projects` | VailNote is an encrypted note-sharing app with zero-knowledge encryption and self-destructing notes. | pass - named the subject |
| WatchLock | `/#projects` | WatchLock lets you lock your phone with your smartwatch. | pass - named the subject |
| Med Research MCP | `/#projects` | Med Research MCP is an MCP server for evidence-graded scientific literature search for AI agents, covering PubMed, Europe PMC, ChinaXiv and RussiaRxiv. | pass - named the subject |
| BIPoC Climate Justice Conference website | `/#projects` | The BIPoC Climate Justice Conference website covers the 2024 and 2025 events, is localized, and is fully markdown-driven. | pass - made the existing description a complete sentence |
| emilkrebs.dev | `/#projects` | emilkrebs.dev is a statically exported site with no server or database. | pass - replaced the unnamed fragment |

The original draft treated descriptions without their project names as passing.
The implementation makes the existing descriptions independently quotable
instead of adding a second answer block. First-person copy remains first-person.

## Chinese equivalents

Only existing values in [the Chinese bundle](../../src/app/lib/i18n/zh.json) and
the lead in [the Chinese story](../../src/app/content/story.zh.mdx) changed.
No translation keys or routes were added. Healthstack has no Chinese detail page;
the Chinese project link continues to use the existing English page.

| Entity | Owning route | Sentence as rendered | Result |
| --- | --- | --- | --- |
| Emil Krebs | `/zh/story/` | Emil Krebs（爱米尔）是德国基尔 TypeFox 的软件工程师。 | pass - first body paragraph |
| TypeFox work | `/zh/` | 在 TypeFox，我构建定制的 VS Code 扩展、使用 LSP 的语言服务器，以及围绕它们的 IDE。 | pass |
| Kiel University education | `/zh/#work` | 工作之余，我在基尔大学全日制攻读计算机科学与社会学学士学位。 | pass |
| Langium Showcase | `/zh/#projects` | Langium Showcase 包含我为 langium.org 构建的状态机、算术、MiniLogo 与领域模型实时编辑器。 | pass |
| Prami | `/zh/#projects` | Prami 是一款主动回忆与间隔重复学习应用，复习日程经精心设计，近乎无感。 | pass |
| VailNote | `/zh/#projects` | VailNote 是一款隐私优先的笔记分享应用。 | pass - preserved the existing localized privacy-first wording |
| WatchLock | `/zh/#projects` | WatchLock 让你用智能手表锁定手机。 | pass |
| Med Research MCP | `/zh/#projects` | Med Research MCP 是面向 AI 代理的循证文献检索 MCP 服务器，支持 PubMed、Europe PMC、ChinaXiv 和 RussiaRxiv。 | pass |
| BIPoC Climate Justice Conference website | `/zh/#projects` | BIPoC Climate Justice Conference 的官方网站涵盖 2024 与 2025 年的活动，支持本地化，完全由 Markdown 驱动。 | pass |
| emilkrebs.dev | `/zh/#projects` | emilkrebs.dev 是一个静态导出的网站，无服务器，无数据库。 | pass |

## llms.txt fact provenance

[The machine-readable summary](../../public/llms.txt) is 1,204 UTF-8 bytes.
It is a summary of the site, not a separate source of new claims.

| Claim | Existing on-site evidence |
| --- | --- |
| Name, role, employer, city | Story lead; homepage hero; TypeFox logo's accessible name; `Person` structured data |
| Frontends, language servers, LSP, DSLs, Theia | Homepage Field, strengths, and project descriptions; Healthstack page |
| TypeScript and Kotlin | Visible project stack tags on the homepage |
| Eclipse Langium contribution | Homepage Field, Open source proof, and Langium Showcase description |
| Current Bachelor's studies at Kiel University | Homepage Work paragraph; existing university affiliation in structured data |
| Prami is a learning app in testing | Homepage Prami description, caption, and testing notice |
| Healthstack is a private IDE dev build with a public DSL playground | Healthstack status, hero badge, and embedded playground; no claim that the full app is publicly hosted |
| VailNote, WatchLock, Med Research MCP | Homepage descriptions and destination links |
| Public email | Existing homepage Contact mailto link and footer |

The draft's language-proficiency claims and B.Sc. abbreviation are omitted:
the rendered site does not establish them. The summary claims Langium
contributions, not unsupported contributions to every technology in the stack.
It includes no age, private contact details, personal health information, or
unannounced projects.

## Regression checks

- Every quotation above appears in an ordinary paragraph in the exported HTML,
  including with JavaScript disabled.
- English and Chinese homepages still have exactly one H1, `Emil Krebs`.
- The story's second paragraph and the rest of each story are unchanged.
- Existing i18n keys, metadata, JSON-LD, routes, CTAs, and design styles are unchanged.
- `out/llms.txt` matches the source byte for byte, starts with `# Emil Krebs`,
  exceeds 50 bytes, and is below 1,500 bytes.
- All seven URLs in the summary returned HTTP 200 on 2026-11-06.
- Contact remains a visible `hello@emilkrebs.dev` mailto link rather than a new
  redundant prose block.
- The five affected routes were checked at 320, 390, and 1,440 CSS pixels with
  no horizontal overflow. Desktop English and mobile Chinese story views were
  also inspected visually; no layout or style adjustment was needed.

See [the probe log](./probe-log.md) for the distinction between local checks,
live edge observations, and manual checks still pending.
