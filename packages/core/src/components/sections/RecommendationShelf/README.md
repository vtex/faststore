# Recommendation Shelf

The `RecommendationShelf` section renders a carousel of personalized product recommendations sourced from a VTEX Recommendations campaign. It reuses the store's standard product cards (`ProductCard`), but resolves its items through a recommendation campaign — cross-sell, similar items, top sellers, personalized, and others — instead of a search query.

Recommendations are served by the VTEX Recommendations BFF and exposed through the `@faststore/api` GraphQL layer (`recommendations`). The section is registered as a global CMS component (`RecommendationShelf`) and can therefore be added to any page through the CMS. The feature is opt-in and disabled by default; it is only active when the `experimental.enableRecommendations` flag is enabled.

## Prerequisites

Enabling the shelf in a store requires two things:

1. **The experimental flag.** `experimental.enableRecommendations` must be set to `true` in the store's `discovery.config.js`. While the flag is disabled (the default), the store neither starts a personalization session nor calls the Recommendations API, and the section renders nothing.
2. **An active VTEX Recommendations campaign.** A campaign and its VRN (campaign identifier) are required — for example, `vrn:recommendations:my-account:rec-persona-v2:abc123`.

For event tracking, the Activity Flow script must be present. It reads the `product:*` meta tags on the product detail page to record the product-view event, and the `data-af-*` attributes rendered by the shelf to record recommendation impressions, views, and clicks.

## Enabling the section

### Enable the flag

In the store's `discovery.config.js` (which overrides `discovery.config.default.js`):

```js
module.exports = {
  // ...
  experimental: {
    // ...
    enableRecommendations: true,
  },
}
```

### Obtain the campaign VRN

In the VTEX Recommendations admin, create or select the campaign and copy its VRN. The VRN follows the pattern:

```text
vrn:recommendations:<account>:<campaign-type>:<campaign-id>
```

The supported `<campaign-type>` values are listed in [Campaign types and product context](#campaign-types-and-product-context).

### Add the section through the CMS

Because the component is registered globally, it is available in the CMS as **Recommendation Shelf**. Add it to the desired page (home, product detail, product listing, cart, and so on) and configure at least the **Campaign VRN**, which is required.

## CMS configuration

The following properties are exposed by the schema (`cms/faststore/components/cms_component__RecommendationShelf.jsonc`):

| Property (CMS) | Key | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Title | `title` | string | No | — | Overrides the shelf title. When empty, the campaign title is used. When neither the title nor the campaign title is available, the heading is not rendered. |
| Campaign VRN | `campaignVrn` | string | Yes | — | The recommendation campaign VRN, validated against the pattern documented below. |
| Items context | `itemsContext` | `PDP` \| `CART` | No | `PDP` | Source of the products used as context for the request. Applies only to context-based campaigns. |
| Carousel Configuration | `carouselConfiguration` | object | No | — | Carousel behavior. |
| › Items per page (desktop) | `itemsPerPageDesktop` | number | No | `4` | Number of items per page on desktop viewports. |
| › Items per page (mobile) | `itemsPerPageMobile` | number | No | `2` | Number of items per page on mobile and tablet viewports (≤ 768px). |
| › Carousel track variant | `variant` | `slide` \| `scroll` | No | `scroll` | How the carousel navigates between items. |
| › Infinite navigation | `infiniteMode` | boolean | No | `false` | Enables infinite navigation (applies only to the `slide` variant). |
| › Navigation controls | `controls` | `complete` \| `navigationArrows` \| `paginationBullets` | No | `complete` | Which navigation controls are displayed. |
| Product Card Configuration | `productCardConfiguration` | object | No | — | Product card options. |
| › Show discount badge | `showDiscountBadge` | boolean | No | `true` | Displays the discount badge. |
| › Bordered cards | `bordered` | boolean | No | `true` | Renders cards with a border. |

## Campaign types and product context

The campaign type is derived from the `<campaign-type>` segment of the VRN:

| Campaign | VRN segment | Internal type | Requires product context |
| :--- | :--- | :--- | :--- |
| Cross-Sell | `rec-cross-v2` | `CROSS_SELL` | Yes |
| Similar Items | `rec-similar-v2` | `SIMILAR_ITEMS` | Yes |
| Visual Similarity | `rec-visual-v2` | `VISUAL_SIMILARITY` | Yes |
| Next Interactions | `rec-next-v2` | `NEXT_INTERACTION` | Yes |
| Personalized | `rec-persona-v2` | `PERSONALIZED` | No |
| Top Sellers | `rec-top-items-v2` | `TOP_ITEMS` | No |
| Last Seen | `rec-last-v2` | `LAST_SEEN` | No |
| Search-Based | `rec-search-v2` | `SEARCH_BASED` | No |

The `itemsContext` property determines the products used as context for the request:

- `PDP` (default): uses the product on the current product detail page (`productGroupID`). Outside a product detail page, no context product is available.
- `CART`: uses the products currently in the cart (deduplicated). This is suited to cross-sell shelves on the cart page.

For context-based campaigns (cross-sell, similar items, visual similarity, and next interactions), when no context product is available — for example, `PDP` context outside a product detail page, or `CART` context with an empty cart — the shelf does not issue the request, avoiding recommendations without an anchor. Context-agnostic campaigns (top sellers, personalized, last seen, and search-based) ignore `itemsContext`.

## How it works

The entire flow runs on the client, after hydration, so it does not affect SSR, TTFB, or Lighthouse metrics.

1. **Session start.** `useStartRecommendationSession()` is mounted globally in `Layout.tsx` and runs on every page, gated by the `enableRecommendations` flag. It fires the `startRecommendationSession` mutation once per browser session, controlled by the `vtex-rec-user-start-session` cookie, and retries with exponential backoff because the endpoint may not be immediately available. The BFF responds with `vtex-rec-*` cookies (`Set-Cookie`), which are persisted through `ctx.storage.cookies`.
2. **User id resolution.** Within the shelf, `useRecommendationUserId()` reads the `vtex-rec-user-id` cookie populated by the session-start flow (step 1), retrying until the cookie is available or the budget is exhausted. It returns a tri-state value: `undefined` (still resolving), `null` (no id available), or a `string` (the resolved id).
3. **Argument resolution.** `getRecommendationArguments()` determines whether — and with which arguments — to fetch. It skips the request when the flag is disabled, when the VRN is invalid or unknown, when no `userId` is available, or when a context-based campaign has no context products. Otherwise, it builds `{ userId, campaignVrn, products }`.
4. **Fetch.** `useRecommendations()` runs the `ClientRecommendationsQuery` query through `useQuery`, returning `products`, `correlationId`, and `campaign { id, title, type }`.
5. **Rendering.** While loading, the section displays `ProductShelfSkeleton`. On error, or when no product is returned, it renders `null`. When products are available, it renders the `<section>` with the carousel and the heading (the CMS title or the campaign title).
6. **Tracking.** When a `correlationId`, `campaignId`, and products are present, the shelf adds the `data-af-*` attributes to the `<section>` (impression and view) and to each item (`data-af-onclick`, `data-af-product-id`, `data-af-product-position`, and others). The product-view event on the product detail page is derived from the `product:*` meta tags rendered in `pages/[slug]/p.tsx` and read by the Activity Flow script.

## Code-level customization

In addition to the CMS properties, the component accepts code-level overrides that are not exposed in the CMS schema. These are useful when the section is composed manually rather than through the CMS:

```tsx
import { RecommendationShelf } from 'src/components/sections/RecommendationShelf'

<RecommendationShelf
  campaignVrn="vrn:recommendations:my-account:rec-cross-v2:abc123"
  itemsContext="PDP"
  ProductCard={MyCustomCard}
  mapProductToProductCard={(product, index) => ({
    product,
    index,
    highlight: index === 0,
  })}
  carouselConfiguration={{ itemsPerPageDesktop: 5, variant: 'slide' }}
/>
```

- `ProductCard`: a custom card component. Defaults to the core `ProductCard`.
- `mapProductToProductCard`: maps each product (a normalized `StoreProduct`, identical to the search shape) to the card props. When provided, it is fully responsible for the card props, and the default `productCardConfiguration` merge no longer applies.

The campaign types and VRN validation have a single source of truth in `vrn.ts` (`VRN_TYPE_TO_RECOMMENDATION`). Adding or changing campaign types must be done there and reflected in the CMS schema `pattern`.

## Placement recommendations

As a global component, the shelf can be added to any page through the CMS. Recommended placements by campaign type:

- **Home and institutional pages:** context-agnostic campaigns (top sellers, personalized, last seen, and search-based).
- **Product detail pages:** context-based campaigns with `itemsContext: PDP` (cross-sell, similar items, visual similarity, and next interactions).
- **Cart page:** cross-sell with `itemsContext: CART`.
- **Product listing pages:** context-agnostic campaigns.

Because the feature is disabled by default behind the `enableRecommendations` flag, stores that do not use Recommendations incur no cost even when the component is registered globally.

## Privacy and caching

- The `recommendations` query is annotated with `@cacheControl(scope: "private", sMaxAge: 120, staleWhileRevalidate: 3600)`. As the result is personalized, it is not cached publicly.
- The error log excludes `recommendationArgs`, which carries the `userId`, and records only non-identifying context (the `campaignVrn`).
- The `vtex-rec-*` cookies returned by the BFF are forwarded to the browser through `ctx.storage.cookies`.

## Troubleshooting

If the shelf does not render, verify the following in order:

1. `experimental.enableRecommendations` is set to `true`.
2. The `campaignVrn` is valid (it matches the schema `pattern`) and the campaign is active.
3. The `vtex-rec-user-id` cookie is being set. It is populated automatically by the session-start flow; if it is missing, confirm the flag is enabled and that cookies are not blocked by an ad blocker or consent management. Without a `userId`, no request is issued.
4. For context-based campaigns, a context product is available: on `PDP`, the page is a product detail page; on `CART`, the cart is not empty.
5. The campaign returned products. When the response is empty, the section renders `null` by design.

If the skeleton remains visible indefinitely, the query is likely pending or repeatedly failing; inspect the console (the error is logged) and the `recommendations` GraphQL response.

If tracking events are missing, confirm that the Activity Flow script is present and that the `product:*` meta tags (on the product detail page) and the `data-af-*` attributes (on the shelf) are being rendered.
