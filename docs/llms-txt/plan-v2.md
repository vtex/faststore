# Plan v2 — `/llms.txt` + `/llms-full.txt` in `@faststore/core`

Builds on the PoC at `plan.md`. Goal: ship two functional routes that pull real content from the store, not just config-driven stubs.

## What changes from v1

The PoC `/llms.txt` is just a curated index built from `discovery.config.llms.customSections`. It works, but a store gets no value out of the box: it has to hand-author every link. v2 wires the GraphQL and CMS sources that v1 left as stubs, and adds a second route that inlines the actual prose.

After v2:
- `/llms.txt` lists categories pulled live from GraphQL, plus institutional pages and landing pages discovered from the CMS.
- `/llms-full.txt` inlines the full text of those pages so an LLM can answer questions, not just navigate.
- Both routes work with zero config beyond setting `llms.enabled = true` and listing a few content type ids the store actually uses.

## Content survey (what we actually have)

Before designing this I checked what the codebase exposes. Three things matter:

1. **GraphQL has `allCollections`** but it isn't currently a persisted query. We need to add one query document under `src/customizations/src/fragments` and let codegen pick it up. Returns slug, seo title/description, breadcrumb — enough for a link with a description.

2. **The CMS has no built-in "institutional page" or "FAQ" content type.** Base content types are landing pages, PLP/PDP templates, home, error pages, and global sections. The base `sections.json` has `BannerText`, `Hero`, `Newsletter`, etc. — no `RichText`, no `Accordion`, no body-text section. Real stores either add a custom RichText section or use the landing page's title/SEO description as the only prose.

3. **No sitemap.xml in the Next app.** It's served upstream by the VTEX edge proxy. We can't reuse a URL list from there; the LLMs routes have to build their own from GraphQL + CMS.

Practical consequence: `llms-full.txt` content comes from three pools, in order of usefulness:

- SEO description fields (`settings.seo.description`) on every CMS-driven page. Short but reliable.
- Whitelisted section names with a known text shape. We extract from `BannerText` (title + caption) and `Hero` (title + subtitle) out of the box. Stores can extend the whitelist via config to include their custom RichText section names.
- A config-level `customPages` array for prose the store wants to inline without putting it in the CMS (e.g. a static About paragraph).

That's enough to make the file useful on a vanilla store. Stores with a RichText custom section get richer output by adding its name to the whitelist.

## File layout

Most of the v1 layout stays. New and changed files:

| Path | Action |
|---|---|
| `packages/core/src/server/llms/sources.ts` | rewrite — wire GraphQL + CMS, drop stubs |
| `packages/core/src/server/llms/extract.ts` | new — pull text out of CMS section payloads |
| `packages/core/src/server/llms/sections.ts` | edit — add `landingPagesSection` |
| `packages/core/src/server/llms/full.ts` | new — `buildLlmsFullTxt(ctx)` |
| `packages/core/src/server/llms/index.ts` | edit — export `buildLlmsFullTxt` |
| `packages/core/src/pages/api/fs/llms-full.ts` | new — second API route |
| `packages/core/src/customizations/src/fragments/AllCollections.ts` | new — persisted GraphQL query |
| `packages/core/next.config.js` | edit — add `/llms-full.txt` rewrite alongside `/llms.txt` |
| `packages/core/discovery.config.default.js` | edit — extend `llms` block (see below) |
| `packages/core/test/server/llms/buildLlmsTxt.test.ts` | edit — cover new sources |
| `packages/core/test/server/llms/buildLlmsFullTxt.test.ts` | new |
| `packages/core/test/server/llms/extract.test.ts` | new |

## Config contract

```js
llms: {
  enabled: true,
  title: 'Acme Store',
  tagline: 'Curated streetwear since 2008.',
  about: 'Long-form paragraph about the brand.',
  contact: {
    email: 'support@acme.com',
    url: 'https://acme.com/contact',
  },

  // NEW: sources we pull from automatically
  sources: {
    // GraphQL top-level categories. false to skip.
    categories: { enabled: true, limit: 25 },

    // CMS content types to discover pages from. Empty array = skip CMS.
    // Most stores will set this to ['landingPage'] and rely on slug allow/deny lists.
    contentTypes: ['landingPage'],

    // Slug allow-list applied to discovered CMS pages.
    // If empty, all pages of the listed contentTypes are included.
    slugAllowList: [],

    // Slugs we never want in the LLM file (e.g. campaign landing pages).
    slugDenyList: ['black-friday', '404', '500'],

    // Names of CMS section components whose text we should extract for llms-full.txt.
    // BannerText and Hero are extracted by default. Add your store's RichText section name here.
    textSectionNames: ['BannerText', 'Hero'],
  },

  // Inline static prose for llms-full.txt without going through the CMS.
  customPages: [
    {
      title: 'About Acme',
      slug: '/about',
      body: 'Long Markdown body…',
    },
  ],

  // Existing v1 fields still work
  customSections: [],
  maxLinksPerSection: 25,
}
```

The shape is forward-compatible: a store on v1 config (no `sources` block) gets sensible defaults — categories on, no CMS discovery, text extraction limited to base sections.

## `/llms.txt` output

Same shape as v1, with two new sections wired to real data:

```
# {title}

> {tagline}

{about}

## Shop by category
- [Office](https://store.com/office): SEO description from the collection, truncated to 120 chars
- … up to limit

## Pages
- [Shipping policy](https://store.com/shipping): SEO description
- [Returns](https://store.com/returns): SEO description
- … discovered from CMS contentTypes + allow/deny list

## Customer service
… (v1 institutional config, still supported for stores that prefer hand-curation)

## Contact
- Email: support@acme.com
- [Contact form](https://store.com/contact)

## Optional
- [Sitemap](https://store.com/sitemap.xml)
- [Full LLM content](https://store.com/llms-full.txt)
```

The `Pages` section is new. It pulls every page of every configured `contentTypes`, applies the allow/deny filter, and renders one link per page with SEO description as the line tail. Capped at `maxLinksPerSection`.

The `Optional` section gains a link to `/llms-full.txt` so an LLM that fetched the index knows the full file exists.

## `/llms-full.txt` output

One self-contained Markdown file. Structure:

```
# {title} — Full content

> {tagline}

{about}

---

# Categories

## Office
URL: https://store.com/office

Office supplies and accessories. (from SEO description)

Selected facets: brand, price, color. (from collection meta, if present)

## Technology
…

---

# Pages

## Shipping policy
URL: https://store.com/shipping

(SEO description paragraph)

(Extracted text from whitelisted sections, joined with blank lines)

## Returns
…

---

# Custom pages

## About Acme
URL: https://store.com/about

(config.llms.customPages[*].body verbatim)
```

Rules for the body text per page:

- Lead with the page's `seo.description` if present.
- Then iterate `sections[]`. For each section whose `name` is in `sources.textSectionNames`, pull `data.title`, `data.caption`, `data.subtitle`, `data.text` (whichever exist). Render each as a paragraph.
- Skip sections we don't recognize. Never render JSON. Never render section names. If a section has no extractable text, omit it.
- Cap the body per page at ~8KB to keep one rogue page from blowing up the file.
- Cap the total file at ~500KB. If the cap would be exceeded, truncate at a page boundary and append a note (`(truncated — N pages omitted)`).

## Route behavior

`/llms-full.txt` mirrors `/llms.txt`:

- `Content-Type: text/markdown; charset=utf-8`
- `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`
- `X-Robots-Tag: noindex`
- 405 on non-GET
- 404 when `llms.enabled === false`
- 500 with empty body on builder throw, error logged server-side

Both routes go through Next.js rewrites. Place them before `storeConfig.rewrites` (already done for `/llms.txt` in v1).

## Implementation order

Eight steps, each one shippable on its own:

1. **Persist `allCollections`.** Add the query document, run codegen, expose a typed helper in `src/server/llms/sources.ts::fetchTopCategories`. Test against the live `execute()` pipeline.

2. **Wire CMS discovery.** In `sources.ts::fetchPagesByContentTypes`, call `contentService.getMultipleContent` for each configured contentType. Apply allow/deny filtering. Return `{ slug, title, description, sections }[]`.

3. **Wire categories into `/llms.txt`.** The `Shop by category` section currently shows config-only data. Switch it to use `fetchTopCategories` when `sources.categories.enabled`. Keep `customSections` as override.

4. **Add the `Pages` section to `/llms.txt`.** New section builder consumes `fetchPagesByContentTypes`, renders link + truncated SEO description.

5. **Build `extract.ts`.** Pure function from a `sections[]` array + whitelist to an array of paragraphs. No CMS or GraphQL dependency. Easy to unit test.

6. **Build `buildLlmsFullTxt`.** Composes the brand header, the categories block, the per-page blocks (SEO description + extracted text), and the custom pages block. Enforces per-page and total-file size caps.

7. **Add the API route + rewrite.** Same skeleton as `/llms.txt`.

8. **Cross-link.** Add the `Optional` link from `/llms.txt` to `/llms-full.txt`. Update the smoke-test docs in `docs/llms-txt/handoff.md`.

## Testing

Unit tests cover the parts that don't need a real CMS:

- `extract.ts`: given a fixture sections array, returns the right paragraphs. Unknown sections ignored. Empty input returns `[]`.
- `buildLlmsTxt`: existing tests still pass; add cases for `Pages` section discovery from injected CMS fixture, deny-list filtering, category limit.
- `buildLlmsFullTxt`: happy path with mixed CMS + custom pages, per-page cap truncation, total file cap with truncation marker, opt-out returns null.

Manual smoke tests, run against the local dev server:

- `GET /llms.txt` → 200, contains a `## Shop by category` block with real category names, contains a `## Pages` block, ends with the `## Optional` block linking to `/llms-full.txt`.
- `GET /llms-full.txt` → 200, parses as Markdown, has one `## ` block per discovered page, includes prose not just titles.
- `GET /llms-full.txt` with `enabled: false` → 404.
- Disable `sources.categories` → category section disappears from both files but the rest still renders.

## Open questions

These don't block shipping but are worth a decision before merge:

- Do we want a per-binding fan-out (`/{locale}/llms.txt`)? The v1 plan deferred this. v2 still defers it — the routes use the current request's binding context, so a multi-locale store gets the right URLs for whichever binding the LLM hits. Fan-out is a discoverability question (how does an LLM find the other locales) and best solved with a future `## Other locales` section.

- CMS API choice: `@vtex/client-cms` vs `@vtex/client-cp`. The `contentService` already routes between them based on `discovery.config.contentSource.type`, so we get this for free. Worth verifying both paths in a real store before merge.

- Cache invalidation. Both routes have `s-maxage=3600`. If a store edits the shipping policy in the CMS, the file is stale for up to an hour. Acceptable for v2 (LLM crawlers are not real-time consumers). If we ever need faster turnaround, wire a revalidation hook off the CMS publish webhook.

- Total file size cap. 500KB is a guess. Real stores will tell us if it's too small.

## Out of scope (still)

- Per-page `.md` files via a catch-all route.
- Multi-binding fan-out URLs.
- Editing `robots.txt` to advertise the LLM files. Worth doing once the platform team confirms the upstream proxy won't intercept.
- Anything in `starter.store`.
