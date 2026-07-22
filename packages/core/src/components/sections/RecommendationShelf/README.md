# Recommendation Shelf

CMS section that renders a carousel of personalized product recommendations from a **VTEX Recommendations** campaign. It uses the same product cards (`ProductCard`) as other store shelves; items come from a recommendation campaign (cross-sell, similar items, top sellers, personalized, and related types) instead of a search query.

- **Data source:** VTEX Recommendations BFF, exposed by `@faststore/api` through the `recommendations` GraphQL query.
- **Registration:** global CMS component (`$componentKey: "RecommendationShelf"`), available on any page via CMS.
- **Opt-in via CMS:** enable Recommendations with the **Enable recommendations?** toggle on the shelf (default `false`). No store code changes or feature flags are required.

## Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [CMS configuration](#cms-configuration)
- [Campaign types (VRN) and context](#campaign-types-vrn-and-context)
- [Runtime behavior](#runtime-behavior)
- [Code-level overrides](#code-level-overrides)
- [Placement guidelines](#placement-guidelines)
- [Privacy and cache](#privacy-and-cache)
- [Troubleshooting](#troubleshooting)

## Prerequisites

The shelf renders products only when the following conditions are met:

1. **Enable recommendations on the shelf.** Set **Enable recommendations?** to `true` on the Recommendation Shelf in the CMS. This opts the store into the personalization session (`startRecommendationSession` mutation, owned by Layout) and allows the shelf to fetch recommendations. Without it (default `false`), no session is started and the shelf does not fetch.

2. **Active VTEX Recommendations campaign.** Provide a valid campaign **VRN**. Example: `vrn:recommendations:my-account:rec-persona-v2:abc123`.

3. **Activity Flow script (optional, recommended).** Used for analytics:
   - reads PDP `product:*` meta tags to capture product view events;
   - reads `data-af-*` attributes on the shelf to capture impression, view, and click events.

## Setup

### 1. Obtain the campaign VRN

In the VTEX Recommendations admin, create or select a campaign and copy its **VRN**. The expected format is:

```text
vrn:recommendations:<account>:<campaign-type>:<campaign-id>
```

Supported `<campaign-type>` values are listed under [Campaign types (VRN) and context](#campaign-types-vrn-and-context).

### 2. Add Recommendation Shelf via CMS

Add **Recommendation Shelf** to the target page (home, PDP, PLP, cart, and so on), configure at least **Campaign VRN** (required), and turn **Enable recommendations?** on.

## CMS configuration

Schema: `cms/faststore/components/cms_component__recommendationshelf.jsonc`.

| CMS property | Key | Type | Required | Default | Description |
| --- | --- | --- | --- | --- | --- |
| Enable recommendations? | `enableRecommendations` | boolean | No | `false` | Opt-in that starts the personalization session (via Layout) and allows this shelf to fetch recommendations. |
| Title | `title` | string | No | — | Overrides the shelf title. Falls back to the campaign title. If both are empty, the heading is not rendered. |
| Campaign VRN | `campaignVrn` | string | **Yes** | — | Recommendation campaign VRN. Validated by regex (see campaign types below). |
| Items context | `itemsContext` | `PDP` \| `CART` | No | `PDP` | Source of products used as request context. Applies only to context-based campaigns. |
| **Carousel Configuration** | `carouselConfiguration` | object | No | — | Carousel settings. |
| › Items per page (desktop) | `itemsPerPageDesktop` | number | No | `4` | Items per page on desktop. |
| › Items per page (mobile) | `itemsPerPageMobile` | number | No | `2` | Items per page on mobile and tablet (≤ 768px). |
| › Carousel track variant | `variant` | `slide` \| `scroll` | No | `scroll` | Carousel navigation mode. |
| › Infinite navigation? | `infiniteMode` | boolean | No | `false` | Infinite navigation (slide variant only). |
| › Navigation controls | `controls` | `complete` \| `navigationArrows` \| `paginationBullets` | No | `complete` | Visible navigation controls. |
| **Product Card Configuration** | `productCardConfiguration` | object | No | — | Product card settings. |
| › Show discount badge? | `showDiscountBadge` | boolean | No | `true` | Shows the discount badge. |
| › Cards should be bordered? | `bordered` | boolean | No | `true` | Renders bordered cards. |

## Campaign types (VRN) and context

The campaign type is derived from the `<campaign-type>` segment of the VRN:

| Campaign | VRN segment | Internal type | Requires product context? |
| --- | --- | --- | --- |
| Cross-Sell | `rec-cross-v2` | `CROSS_SELL` | **Yes** |
| Similar Items | `rec-similar-v2` | `SIMILAR_ITEMS` | **Yes** |
| Visual Similarity | `rec-visual-v2` | `VISUAL_SIMILARITY` | **Yes** |
| Next Interactions | `rec-next-v2` | `NEXT_INTERACTION` | **Yes** |
| Personalized | `rec-persona-v2` | `PERSONALIZED` | No |
| Top Sellers | `rec-top-items-v2` | `TOP_ITEMS` | No |
| Last Seen | `rec-last-v2` | `LAST_SEEN` | No |
| Search-Based | `rec-search-v2` | `SEARCH_BASED` | No |

**Product context (`itemsContext`):**

- `PDP` (default): uses the current product detail page product (`productGroupID`). Outside a PDP there is no product context.
- `CART`: uses the products currently in the cart (deduplicated). Intended for cross-sell on the cart page.

Context-based campaigns (cross-sell, similar items, visual similarity, next interaction) skip the request when no context products are available. Context-agnostic campaigns (top sellers, personalized, last seen, search-based) ignore `itemsContext`.

## Runtime behavior

All recommendation work runs client-side after hydration:

1. **Session start (CMS opt-in)** — `Layout` calls `useStartRecommendationSession(pageProps)` once. The hook checks whether any `RecommendationShelf` in the CMS data has `enableRecommendations: true` and no-ops when none do. Multiple enabled shelves on the same page still start the session only once (in-memory lock + session cookie).
2. **User id resolution** — `useRecommendationUserId()` reads the `vtex-rec-user-id` cookie, retrying until a value is available or the retry budget is exhausted.
3. **Request arguments** — when enabled, `getRecommendationArguments()` builds `{ userId, campaignVrn, products }` or returns `null` when the VRN is invalid, the user id is missing, or a context-based campaign has no context products. When disabled, arguments stay `null`.
4. **Fetch** — `useRecommendations()` runs `ClientRecommendationsQuery` and returns `products`, `correlationId`, and `campaign`.
5. **Render** — shows `ProductShelfSkeleton` while loading; returns `null` on error or empty results; otherwise renders the carousel and optional heading.
6. **Tracking** — when correlation and campaign identifiers are present, the shelf emits `data-af-*` attributes for Activity Flow. PDP product views use `product:*` meta tags from `pages/[slug]/p.tsx`.

Related files:

- Shelf: `src/components/sections/RecommendationShelf/`
- Hook: `src/sdk/analytics/hooks/useStartRecommendationSession.ts`
- Layout: `src/Layout.tsx`

## Code-level overrides

In addition to CMS props, the component accepts code-level overrides (not exposed in the CMS schema):

```tsx
import { RecommendationShelf } from 'src/components/sections/RecommendationShelf'

<RecommendationShelf
  enableRecommendations
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

- **`ProductCard`**: custom card component (defaults to the core `ProductCard`).
- **`mapProductToProductCard`**: maps each recommended product (normalized `StoreProduct`) into card props. When provided, it fully owns the card props and the default `productCardConfiguration` merge no longer applies.

Campaign types and VRN validation are defined in `vrn.ts` (`VRN_TYPE_TO_RECOMMENDATION`). Updates should be made there and mirrored in the CMS schema `pattern`.

## Placement guidelines

As a global component, the shelf can be placed on any CMS page. Suggested placements by campaign type:

- **Home / institutional pages:** context-agnostic campaigns (top sellers, personalized, last seen, search-based).
- **PDP:** context-based campaigns with `itemsContext: PDP`.
- **Cart:** cross-sell with `itemsContext: CART`.
- **PLP:** context-agnostic campaigns.

The personalization session runs only when at least one shelf has **Enable recommendations?** turned on.

## Privacy and cache

- The `recommendations` query uses `@cacheControl(scope: "private", sMaxAge: 120, staleWhileRevalidate: 3600)`.
- Error logs omit `recommendationArgs` (which includes `userId`) and log only non-identifying context such as `campaignVrn`.
- BFF `vtex-rec-*` cookies are forwarded to the browser through `ctx.storage.cookies`.

## Troubleshooting

**The shelf does not render.** Check, in order:

1. Is **Enable recommendations?** set to `true` on the shelf?
2. Is `campaignVrn` valid and is the campaign active?
3. Is the `vtex-rec-user-id` cookie available? Without a user id, the shelf does not fetch.
4. For context-based campaigns, is product context available (`PDP` on a product page, or a non-empty cart for `CART`)?
5. Did the campaign return products? An empty response renders nothing by design.

**Skeleton never resolves.** Inspect the console and the GraphQL `recommendations` response for pending or failing requests.

**No tracking events.** Confirm that the Activity Flow script is present and that PDP `product:*` meta tags and shelf `data-af-*` attributes are rendered.
