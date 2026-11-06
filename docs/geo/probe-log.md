# GEO probe log

Observations are append-only. Add new runs and dated corrections; never overwrite
an earlier answer to improve a score.

## Baseline status

2026-11-06: the owner approved local implementation while unavailable manual
checks remain pending. **No AI baseline runs have been completed.** The 96
required responses have not been fabricated or inferred from crawlability,
structured data, search results, or another engine.

The live site has not been deployed from this branch. Complete the logged-out
baseline before deployment, then record the deployment time and commit so later
comparisons have a meaningful boundary. If the site is deployed first, record
that limitation and start a post-deployment baseline rather than backdating one.

## Technical baseline: 2026-11-06, 17:32 UTC

These are live HTTP observations, not AI mention or citation measurements.

| Check | Observation | Result |
| --- | --- | --- |
| Homepage, GPTBot user agent | HTTP 200 | pass |
| Homepage, PerplexityBot user agent | HTTP 200 | pass |
| Homepage, ClaudeBot user agent | HTTP 200 | pass |
| Homepage, Bingbot user agent | HTTP 200 | pass |
| Homepage, Baiduspider user agent | HTTP 200 | pass |
| Homepage, Bytespider user agent | HTTP 200 | pass |
| Edge robots.txt | HTTP 200, `text/plain; charset=utf-8`; wildcard allow and sitemap only | pass |
| Cloudflare-managed robots block | No `# BEGIN Cloudflare Managed content` block | pass |
| Live llms.txt before deployment | HTTP 404, `text/html; charset=utf-8` | expected pre-change baseline; post-deploy check pending |
| LinkedIn public profile | HTTP 999 | blocked; see [entity parity](./entity-parity.md) |

The observed robots body was:

```text
User-Agent: *
Allow: /

Sitemap: https://emilkrebs.dev/sitemap.xml
```

User agents were sent as `Mozilla/5.0 (compatible; BOT_NAME/1.0)`. These requests
test the current edge response to those strings; they do not prove that requests
from every vendor IP will receive the same treatment.

## Local release checks: 2026-11-06

| Check | Scope | Result |
| --- | --- | --- |
| `npm run lint` | Repository | pass |
| `npm run build` | Playground, images, Next.js static export and TypeScript | pass; npm reports an existing unsupported local `python` config warning |
| llms.txt content | Source and exported asset | 1,204 bytes, identical content, correct H1, factual identity wording |
| Local llms.txt serving | Temporary static server serving the export | HTTP 200, `Content-Type: text/plain`; not a production edge check |
| llms.txt URLs | Live home, story, Healthstack, Chinese home, Chinese story, imprint, privacy | All seven HTTP 200 |
| Answer extraction | Local exported EN/ZH paragraphs, without JavaScript | All 21 quotations in the [answer audit](./answer-audit.md) present |
| Homepage H1 | Local EN and ZH export | One per page, unchanged `Emil Krebs` |
| Entity graph | Local EN/ZH home and story export | Existing Person and WebSite identities retained; no FAQPage or self-Organization added |
| Responsive rendering | Home, Chinese home, story, Chinese story, Healthstack at 320, 390, and 1,440 CSS pixels | All 15 route/viewport checks returned 200 with one H1 and no horizontal overflow |
| Visual inspection | Desktop English story in dark mode; mobile Chinese story in light mode | Updated leads fit the existing layout without style changes |

The exported file is not proof of the production Content-Type. After an
authorized deployment, verify `https://emilkrebs.dev/llms.txt` returns HTTP 200
with `Content-Type: text/plain`, the expected body, and working links.

## AI probe protocol

- Engines: ChatGPT, Claude, Perplexity, Gemini, each logged out in a fresh private
  session. Record the product and model version only when shown.
- Run all eight queries three times per engine in separate conversations:
  4 engines x 3 repetitions x 8 queries = 96 responses per measurement round.
- Keep each query verbatim and use a fresh conversation so prior prompts do not
  teach the engine the desired answer.
- Record UTC date/time, engine, model or `not shown`, query, mention (`Y` / `N`),
  citation (actual URL(s) or `none`), and accuracy (`correct` / `partly` / `wrong`).
- `Y` means the intended software engineer or project is identified, not merely
  that the character sequence "Emil Krebs" appears. A response about another
  person is not a successful identity match.
- If an engine requires sign-in or fails, record `blocked` and the reason in a
  separate observation. Do not score it `N`, replace it with an API/search result,
  or silently reduce the denominator.
- Preserve the answer or a capture alongside the run when available. Any claims
  about improvements require actual before/after observations.

### Fixed query set

| ID | Query | Accuracy check |
| --- | --- | --- |
| Q1 | Who is Emil Krebs? | Identifies the intended software engineer, without conflating people |
| Q2 | Emil Krebs software engineer Kiel | Correct role and city |
| Q3 | Emil Krebs TypeFox Langium | Correct employer and contribution; no invented ownership |
| Q4 | Who develops Langium? | Correct project attribution; does not describe one contributor as the sole developer |
| Q5 | Healthstack biohacking DSL | Correct project, DSL, and preview/dev-build status; no medical claims |
| Q6 | Prami supplement tracker app | Rejects the false premise: Prami is a learning app using active recall and spaced repetition, not a supplement tracker |
| Q7 | Emil Krebs 软件工程师 | Identifies the intended software engineer |
| Q8 | 爱米尔 软件工程师 德国 | Associates the Chinese alternate name with the intended software engineer |

### Run format

Append one section per engine and repetition, with one row per query. Start with
12 baseline tables (four engines, three repetitions), each containing eight real
observations. The empty template below is not a completed run.

```markdown
### YYYY-MM-DDTHH:MM:SSZ - ENGINE - baseline/follow-up - repetition N of 3

Session: private, logged out, fresh conversation per query.
Model: exact displayed name, or not shown.
Site revision / deployment boundary: ...

| Date (UTC) | Engine | Model | Query | Mention | Citation URL(s) | Accuracy | Evidence / notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
```

### Completed AI runs

None yet.

## Cadence and remaining release checks

- Before deployment: complete the manual baseline and verify the external profile
  fields in [entity parity](./entity-parity.md).
- After deployment: check llms.txt status, MIME type, bytes, and links at the edge.
  Run validator.schema.org and Google Rich Results Test on `/` and `/story/`.
  These external validator checks are **not yet run**; local JSON-LD checks are
  not a substitute. Retain the existing graph instead of adding schema just to
  obtain a rich-result feature.
- Repeat the 96-response measurement every two weeks after the baseline.
  Review accumulated results monthly; turn a repeated omission or wrong answer
  into a task for the page that owns the subject.
- Repeat the edge crawler check quarterly (next due 2027-02-06) and after every
  Cloudflare setting change. A managed robots block is an edge configuration
  regression, not a reason to add a per-bot allow-list to the repository.

  ```bash
  for ua in GPTBot PerplexityBot ClaudeBot Bingbot Baiduspider Bytespider; do
    printf "%-14s " "$ua"
    curl -s -o /dev/null -w "%{http_code}\n" -A "Mozilla/5.0 (compatible; $ua/1.0)" https://emilkrebs.dev/
  done
  curl -s https://emilkrebs.dev/robots.txt
  ```

  Pass: every request 200, and a robots body containing only `User-Agent: *`,
  `Allow: /`, and the sitemap line.
