# Off-site entity parity

Checked: 2026-11-06. No external profiles were edited.

`match` means the public evidence was observed and agrees with the site.
`fix` means an observed gap or an explicitly unverified field needs owner action.
An inaccessible field is not evidence that the field is wrong.

## Evidence

- [GitHub profile](https://github.com/emilkrebs): public profile fields from
  `gh api users/emilkrebs`, public profile README from
  `gh api repos/emilkrebs/emilkrebs/readme`, and six pinned repositories from
  the GitHub GraphQL API. The profile URL also returned HTTP 200.
- [LinkedIn profile](https://www.linkedin.com/in/emilkrebs): the public fetch
  returned HTTP 999. No headline, location, employment, education, or website
  value could be verified. Owner verification is required; access restrictions
  were not bypassed.
- The site's profile links and `Person.sameAs` remain in
  [constants](../../src/app/lib/constants.ts),
  [structured data](../../src/app/lib/structured-data.ts), and
  [the footer](../../src/app/components/footer.tsx).

## Field-by-field comparison

| Platform | Field | Site target | Observed value / evidence | Status | Checked |
| --- | --- | --- | --- | --- | --- |
| GitHub | Name | Emil Krebs | `Emil Krebs` | match | 2026-11-06 |
| GitHub | Alternate name, where supported | 爱米尔 | Not present in the public name or README; GitHub has no dedicated alternate-name field. An optional README mention can carry it without replacing the name. | fix - optional parity gap | 2026-11-06 |
| GitHub | Role / bio | Software Engineer | Bio describes a "passionate developer"; the README hero alt text already says "Software Engineer at TypeFox GmbH, Kiel". Put the factual role in the bio as well. | fix - bio wording | 2026-11-06 |
| GitHub | Employer | TypeFox | `TypeFox GmbH` in the company field and README | match | 2026-11-06 |
| GitHub | City | Kiel, Germany | `Kiel, Germany` | match | 2026-11-06 |
| GitHub | Website | https://emilkrebs.dev | `https://emilkrebs.dev/` in the website field and README; trailing slash is equivalent | match | 2026-11-06 |
| GitHub | University | Kiel University, current Bachelor's studies | No university or current degree found in the profile fields or README. Do not imply graduation or introduce B.Sc. without confirmation. | fix - missing | 2026-11-06 |
| GitHub | Pinned repositories | Projects represented on the site | VailNote, WatchLock, Generator-Discord, langium-website, langium, Nitrado-Bot; current products, open-source work, and story archives | match | 2026-11-06 |
| GitHub | Link back to the site | https://emilkrebs.dev | Both the website field and README link back | match | 2026-11-06 |
| LinkedIn | Name | Emil Krebs | Not retrieved (HTTP 999) | fix - verify manually | 2026-11-06 |
| LinkedIn | Alternate name, where supported | 爱米尔 | Not retrieved (HTTP 999); optional if the platform supports it | fix - verify manually | 2026-11-06 |
| LinkedIn | Headline / role | Software Engineer | Not retrieved (HTTP 999) | fix - verify manually | 2026-11-06 |
| LinkedIn | Employer / current position | TypeFox | Not retrieved (HTTP 999) | fix - verify manually | 2026-11-06 |
| LinkedIn | City | Kiel, Germany | Not retrieved (HTTP 999) | fix - verify manually | 2026-11-06 |
| LinkedIn | Website field | https://emilkrebs.dev | Not retrieved (HTTP 999) | fix - verify manually | 2026-11-06 |
| LinkedIn | University / education | Kiel University, current Bachelor's studies | Not retrieved (HTTP 999) | fix - verify manually | 2026-11-06 |
| LinkedIn | Link back to the site | https://emilkrebs.dev | Not retrieved (HTTP 999); a configured outbound `sameAs` link does not prove a backlink | fix - verify manually | 2026-11-06 |

## Owner follow-up

1. Align the GitHub bio with the existing factual role, employer, and location.
   Add current university studies to the profile README if desired.
2. Verify each LinkedIn field in the table and record its actual value and date.
   Check the website link in both directions. Do not mark the platform as passing
   merely because its URL is present on the site.
3. Keep pinned repositories representative; there is no need to pin a private
   or unavailable project just to mirror a list.
4. Do not create empty Stack Overflow, dev.to, or Medium accounts for this task.
   Genuine writing or independent coverage can be linked when it exists; no
   outreach, new accounts, company pages, or Wikidata item were created.
