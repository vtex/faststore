# Plan — `/llms.txt` PoC in `@faststore/core`

Working plan for Claude to implement. Scope is intentionally narrow: a single curated `/llms.txt` at the site root, built dynamically at request/build time. No per-page `.md`, no `llms-full.txt`.

## Goal

Ship a feature-flagged Next.js route in `@faststore/core` that serves `/llms.txt` with curated, fresh content sourced from `discovery.config`, the GraphQL API (categories), and the CMS (institutional pages / FAQ).

## Non-goals (this PR)

- Per-page Markdown (`<url>.md`)
- `llms-full.txt`
- Multi-binding fan-out beyond the current locale
- Edits to `robots.txt` or `sitemap.xml`
- Anything in `starter.store`

## Files to touch

| Path | Action | Notes |
|---|---|---|
| `packages/core/src/pages/api/fs/llms.ts` | new | API route. Emits `text/markdown; charset=utf-8`. Returns 404 when `llms.enabled === false`. |
| `packages/core/next.config.js` | edit | Add rewrite `{ source: '/llms.txt', destination: '/api/fs/llms' }`. Place before `storeConfig.rewrites` so store overrides win. |
| `packages/core/src/server/llms/index.ts` | new | Exports `buildLlmsTxt(ctx)`. Pure function from inputs to string. |
| `packages/core/src/server/llms/sections.ts` | new | Section builders: `brandHeader`, `categories`, `policies`, `faq`, `optional`. Each returns `string \| null`. |
| `packages/core/src/server/llms/sources.ts` | new | Server-side fetchers: `fetchTopCategories()`, `fetchInstitutionalPages()`. Wrap existing `execute` (GraphQL) and `contentService` (CMS). |
| `packages/core/src/server/llms/format.ts` | new | Markdown helpers: `link()`, `truncate(s, 120)`, `section(title, items)`. |
| `packages/core/discovery.config.default.js` | edit | Add `llms` block (see contract below). |
| `packages/core/src/typings/storeConfig.d.ts` (or wherever store config types live — verify) | edit | Type the `llms` block. |
| `packages/core/test/server/llms/buildLlmsTxt.test.ts` | new | Vitest. Mocks sources, asserts Markdown structure (H1 present, sections ordered, link truncation, opt-out → empty/null). |

Verify before coding: the exact path of the store config type, and the existing GraphQL query name for top-level categories. Grep `allCollections` / `Department` in `packages/core/@generated` and `packages/api`.

## `discovery.config.llms` contract

```js
llms: {
  enabled: true,
  title: 'Acme Store',
  tagline: 'Curated streetwear since 2008.',
  about: 'Long-form paragraph about the brand, mission, audience.',
  contact: {
    email: 'support@acme.com',
    url: 'https://acme.com/contact',
  },
  // Optional overrides — when present, skip the CMS lookup for that section.
  customSections: [
    { title: 'Press', items: [{ name: 'Newsroom', url: '/press', description: '...' }] },
  ],
  // CMS slug allow-list for institutional pages. If omitted, fetch all.
  institutionalSlugs: ['shipping', 'returns', 'privacy-policy', 'terms'],
  // Cap to keep file small and within small context windows.
  maxLinksPerSection: 25,
}
```

## Output contract

```markdown
# {title}

> {tagline}

{about}

## Shop by category
- [Name]({storeUrl}/{slug}): description ≤120 chars

## Customer service
- [Shipping policy](url): ...
- [Returns & exchanges](url): ...
- [Privacy policy](url): ...
- [Terms of service](url): ...

## FAQ
- [Topic](url): ...

## Contact
- Email: support@acme.com
- [Contact form](url)

## Optional
- [Sitemap]({storeUrl}/sitemap.xml)
```

Rules:
- All URLs absolute (use `getStoreURL()` from `src/sdk/localization/useLocalizationConfig`).
- No prices, no stock, no SKUs, no leaf categories.
- Section omitted entirely if its builder returns `null`.
- Total link count capped at ~50 across the file (sum of `maxLinksPerSection`).
- Output ends with single trailing newline.

## Route behavior (`api/fs/llms.ts`)

```
GET /llms.txt  →  rewrite  →  /api/fs/llms
```

- `Content-Type: text/markdown; charset=utf-8`
- `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`
- `X-Robots-Tag: noindex` (file is for LLMs, not for SERPs)
- Method guard: 405 on non-GET
- On `llms.enabled === false` → 404 with empty body
- On builder throw → 500 with empty body; log via existing logger; never leak stack

## Implementation steps (in order)

1. Add `llms` typing + defaults to `discovery.config.default.js` and the store config type. No behavior yet.
2. Create `src/server/llms/format.ts` with pure helpers. Unit test it.
3. Create `src/server/llms/sources.ts`. Wire `fetchTopCategories` via existing GraphQL `execute`. Stub `fetchInstitutionalPages` against `contentService` — confirm content type with the CMS team before finalizing field mapping.
4. Create `src/server/llms/sections.ts`. Each section pure: `(data, config) => string | null`.
5. Create `src/server/llms/index.ts` orchestrating sources + sections.
6. Create the API route. Keep it thin — just I/O, headers, error mapping.
7. Add the rewrite in `next.config.js`.
8. Tests: `buildLlmsTxt.test.ts` covering the happy path, opt-out, empty CMS, oversized descriptions (truncation), and link cap enforcement.
9. Smoke test locally: `pnpm --filter @faststore/core dev`, hit `http://localhost:3000/llms.txt`, verify headers and body.
10. Update `packages/core/CHANGELOG.md` (follow existing format).

## Open questions to resolve before merge

These are tracked in `handoff.md`. None of them block opening a draft PR, but they block merging:

1. VTEX edge proxy interception of `/llms.txt`.
2. Multi-binding strategy.
3. CMS content type for institutional pages (depends on the store, may need a config slot).
4. Caching TTL alignment with platform infra.

## Testing checklist

- [ ] Unit: `buildLlmsTxt` against fixtures.
- [ ] Unit: section builders return `null` on empty input.
- [ ] Unit: link descriptions truncated at 120 chars.
- [ ] Manual: `GET /llms.txt` returns 200, correct `Content-Type`, parses as Markdown.
- [ ] Manual: with `llms.enabled = false`, returns 404.
- [ ] Manual: with a multi-locale store, current binding's locale is reflected in URLs.
- [ ] Cypress: minimal smoke test under `packages/core/cypress/` — request `/llms.txt`, assert 200 + `text/markdown` + `# ` first line.

## Rollout

- Feature flag via `discovery.config.llms.enabled`. Default `false` in `discovery.config.default.js` for this PR — store opts in explicitly. Flip the default after one minor release of bake time.
- No migration needed.

## Out of scope follow-ups (separate PRs)

- `.md` per page via `[...slug].md.tsx` catch-all.
- `llms-full.txt` (only if a real consumer asks).
- Multi-binding fan-out (`/{locale}/llms.txt`).
- Optional `discovery.config.llms.advertiseInRobots` to inject a hint line in `robots.txt` if the platform team agrees.
