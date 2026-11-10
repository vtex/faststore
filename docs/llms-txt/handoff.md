# `llms.txt` for FastStore — Research, Benchmark, Handoff

Status: investigation complete. PoC branch open: `feat/llms-txt-poc`. Implementation plan in `plan.md`.

This document is the PR handoff: what we learned, what we benchmarked, what we decided, and what is still open.

---

## TL;DR

- `llms.txt` is a 2024 proposal by Jeremy Howard (Answer.AI) for a curated Markdown index at `/llms.txt`, scoped to be ingestible by LLMs with limited context windows.
- As of May 2026 the spec is widely adopted in **technical documentation** (Anthropic, Stripe, Vercel, Cloudflare, Mintlify, Cursor) and largely **ignored by general web crawlers** (Google publicly declined; GPTBot/ClaudeBot/PerplexityBot show no consistent fetch behavior in audits).
- For e-commerce, consensus says: **do not dump the SKU catalog**. Expose brand, top categories, policies, FAQ, contact. Keep the file small and curated.
- We picked the smallest sensible scope for FastStore v1: a single, build-time-dynamic `/llms.txt` at the root, no per-page `.md`, no `llms-full.txt`, feature-flagged.

---

## Why bother (and why be skeptical)

**Pro:**

- Cost is near-zero once the pipeline exists.
- It forces an editorial inventory of what the store wants AI to cite.
- Coding agents (Cursor, Claude Code, Windsurf) demonstrably fetch `llms.txt` for libraries. The same mechanism may extend to commerce agents (Rufus, Perplexity Shopping, ChatGPT shopping) as those tools mature.
- Easier to ship now than retrofit when (if) a provider commits.

**Con:**

- No measurable lift in AI citations in published studies through late 2025.
- Redundant with `sitemap.xml` + clean HTML + Schema.org for crawlers that already index the public web.
- Risk of stale content if the file isn't generated dynamically.

Net call: ship it, keep it cheap, do not over-invest until a major provider commits.

---

## Spec summary (from llmstxt.org)

- Location: `/llms.txt` at site root.
- Format: Markdown. Served as `text/markdown` (or `text/plain`).
- Required: a single `# H1` title.
- Recommended: a `> blockquote` one-line summary, then free-form context paragraphs, then `## Section` headers each containing a list of `[name](url): description` links.
- Reserved: a `## Optional` section that ingestion tools may skip when context is tight.
- Companion (not required, but the de facto convention): each HTML page also reachable as Markdown — either at `<url>.md` or via `Accept: text/markdown` content negotiation.

### `llms.txt` vs `llms-full.txt`

| | `llms.txt` | `llms-full.txt` |
|---|---|---|
| Purpose | Curated index, pointers | Full content dump for ingestion/RAG |
| Size | Small (fits a context window) | Can be huge (Anthropic's is millions of tokens) |
| Audience | Agents fetching at runtime | Bulk ingestion pipelines |
| Freshness need | High | Lower |

We are shipping only `llms.txt` for now. `llms-full.txt` doesn't make sense for a live commerce catalog and the ingestion-side value for commerce is unproven.

---

## Benchmark — who is doing this, and how

| Org | Pattern | What's interesting |
|---|---|---|
| Anthropic | `llms.txt` + `llms-full.txt` + per-page `.md` | The reference implementation. `llms-full.txt` is a single concatenated dump. |
| Stripe | Curated catalog by product vertical | Sections per product (Payments, Connect, Billing) instead of one flat list. |
| Vercel | `llms.txt` + per-page `.md` via content negotiation | Same URL serves HTML or Markdown depending on `Accept`. |
| Cloudflare | Per-product catalog, similar to Stripe | Heavy use of `## Optional` to defer ancillary pages. |
| Mintlify | Auto-generated for every hosted docs site (Nov 2024) | This is why most "adopters" are docs sites — Mintlify ships it by default. |
| Cursor / Windsurf | Focused workflow (small `llms.txt`) | Slim, opinionated, points only at canonical references. |
| Supabase, LangGraph, Bolt | Similar to Vercel | Standard docs pattern. |

### E-commerce specific reading

There are blog posts (Kiwi Commerce, Stryde, Goodie, tngshopper, Shero) recommending `llms.txt` for DTC brands. None of them publish convincing measurement of lift. Their structural recommendations converge:

1. Brand summary at the top.
2. Top-level categories only — not leaves, not SKUs.
3. Policies (shipping, returns, warranty, privacy, terms).
4. FAQ / size guides / customer service.
5. About / contact.
6. Rely on Schema.org Product JSON-LD (already present in FastStore PDP) for product-level signal — not `llms.txt`.

This matches the scope we picked.

---

## Crawler reality check (May 2026)

- **Google** (Search Central Live, Jul 2025): does not support `llms.txt`, no plans to.
- **GPTBot, ClaudeBot, PerplexityBot**: audits through Oct 2025 show no consistent fetch of `/llms.txt`. Sporadic GPTBot hits, no commitment.
- **Coding assistants** (Cursor, Claude Code, Windsurf, Continue): do fetch on demand. Measurable value here, but for library docs — not for commerce.
- **Discovery**: no standardized mechanism. Crawlers must guess `/llms.txt`. `robots.txt` does not reference it.

What this means for FastStore: the immediate upside is low. The bet is option value if/when shopping-oriented agents adopt the convention.

---

## What FastStore looks like today

Findings from `packages/core`:

- Next.js Pages Router. PDP is `src/pages/[slug]/p.tsx` with `getStaticProps` and `ProductJsonLd`/`BreadcrumbJsonLd`. Search at `src/pages/s.tsx`. CMS catch-all at `src/pages/[...slug].tsx`.
- API routes in `src/pages/api/fs/` (only `logout.ts`, `graphql.ts`, `preview.ts` today).
- `public/` contains only favicon/logo/icons. No `robots.txt` or `sitemap.xml` in the repo — those are served upstream by the VTEX edge.
- `next.config.js` uses `storeConfig.rewrites`. No `headers()` block. No existing precedent for serving static-like text endpoints from the Next app.
- Existing server-side helpers: `execute` for GraphQL (`src/server`), `contentService` for CMS (`src/server/content`), `getStoreURL()` for absolute URLs (`src/sdk/localization/useLocalizationConfig`).
- Locale/binding awareness already wired via `src/utils/localization/bindingPaths`.

The route + builder pattern fits cleanly into this layout.

---

## Decisions taken

| Decision | Choice | Why |
|---|---|---|
| Scope v1 | Single `/llms.txt` only | Cheapest path to learn. No `.md` per page, no `llms-full.txt`. |
| Source of truth | Dynamic at build/request | Static file goes stale. `discovery.config` + GraphQL + CMS. |
| Default state | `enabled: false` in `discovery.config.default.js` | Stores opt in. Flip default after a bake period. |
| Include SKUs | No | Catalogs go stale in hours. Schema.org on PDP covers product signal. |
| Multi-binding | Single locale (current binding) in v1 | Multi-locale fan-out is a follow-up. |
| Implementation surface | `packages/core` only | Don't touch `starter.store`. |

---

## Open questions — must resolve before merge

1. **VTEX edge proxy interception of `/llms.txt`.** `robots.txt` and `sitemap.xml` are served by the upstream proxy, not the Next app. We need to confirm `/llms.txt` is *not* intercepted, or arrange a passthrough. **Owner: platform team.**
2. **Multi-binding store behavior.** Single file with multi-locale links, or one file per binding (`/en/llms.txt`, `/pt/llms.txt`)? For v1 we ship single-binding; need product input on whether that is acceptable for current customers. **Owner: product.**
3. **CMS content type for institutional pages.** Which content type and which slugs canonically represent shipping / returns / privacy / terms? Likely store-specific, hence the `institutionalSlugs` config slot — but a sensible default would be nice. **Owner: CMS team.**
4. **Caching TTL alignment.** Default `s-maxage=3600, stale-while-revalidate=86400` — confirm this aligns with the VTEX edge cache policy. **Owner: platform team.**

---

## Open questions — soft / can defer

5. **Should we advertise `/llms.txt` in `robots.txt`?** Not part of the spec. Some advocate it. Defer until robots.txt ownership is clarified (platform-side today).
6. **`X-Robots-Tag: noindex` on the response?** Probably yes — the file isn't meant for SERPs. Low-risk default; included in the plan.
7. **Rate limiting / abuse.** The endpoint is cheap and cached, but if it becomes a hotspot we may want to align with existing FastStore rate-limit primitives. No action for v1.
8. **i18n of the markdown body itself** (section titles like "Shop by category"). For v1 we use English; later expose strings via the existing i18n surface.

---

## Risks

- Edge proxy collision (open question #1). If unresolved, the PR ships but the route is unreachable in production. Mitigation: validate with platform team before opening the PR for review.
- Drift between this convention and a future "official" spec from a major provider. Mitigation: feature-flag, isolated module under `src/server/llms/`, easy to rip out.
- Customer expectations. Once we ship, stores may expect AI traffic / citation lift that may not materialize in 2026. Mitigation: be explicit in release notes about the "option value" framing.

---

## Artifacts in this PR

- `docs/llms-txt/plan.md` — implementation plan (this is what Claude will follow).
- `docs/llms-txt/handoff.md` — this document.
- `docs/llms-txt/handoff.html` — HTML render of this document for sharing.

---

## Sources

- [llmstxt.org — official spec](https://llmstxt.org/)
- [Mintlify — real llms.txt examples](https://www.mintlify.com/blog/real-llms-txt-examples)
- [Mintlify — llms.txt docs](https://www.mintlify.com/docs/ai/llmstxt)
- [Mintlify — value of llms.txt: hype or real?](https://www.mintlify.com/blog/the-value-of-llms-txt-hype-or-real)
- [Mintlify — context for agents (content negotiation)](https://www.mintlify.com/blog/context-for-agents)
- [Codersera — honest guide May 2026](https://codersera.com/blog/llms-txt-complete-guide-2026/)
- [llms-txt.io — Is llms.txt dead? (2025)](https://llms-txt.io/blog/is-llms-txt-dead)
- [IndexLab — Does it actually work? Oct 2025](https://www.indexlab.ai/blog/llms-txt-does-it-actually-work-october-2025-updated)
- [Longato — AI crawlers ignore it, 2025 audit](https://www.longato.ch/llms-recommendation-2025-august/)
- [Pixelmojo — static vs dynamic implementation](https://www.pixelmojo.io/blogs/llms-txt-static-vs-dynamic-implementation-guide)
- [Kiwi Commerce — setup for WordPress/Shopify/Magento](https://kiwicommerce.co.uk/llms-txt-setup-guide-for-wordpress-shopify-magento-and-custom-websites/)
- [tngshopper — llms.txt for e-commerce](https://www.tngshopper.com/post/llms-txt-for-e-commerce-a-practical-guide-to-preparing-your-site-for-ai-crawlers)
- [Goodie — optimizing llms.txt for e-commerce](https://higoodie.com/blog/llms-txt-for-ecommerce/)
- [Stryde — llms.txt for DTC brands](https://www.stryde.com/llms-txt-for-dtc-brands-what-it-is-why-it-matters-and-how-to-implement-it/)
- [Shero Commerce — LLM-friendly product descriptions](https://sherocommerce.com/blogs/insights/10-real-examples-of-llm-friendly-product-descriptions)
- [DeployHQ — content negotiation & Markdown serving](https://www.deployhq.com/blog/making-your-documentation-ai-friendly-serving-markdown-to-ai-coding-assistants)
- [Akupara — robots.txt vs llms.txt vs ai.txt](https://www.akuparaai.com/blog/robots-txt-llms-txt-ai-txt-standards)
