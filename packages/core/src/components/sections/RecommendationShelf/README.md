# Recommendation Shelf

CMS section that renders a carousel of personalized product recommendations from a **VTEX Recommendations** campaign. It uses the same product cards (`ProductCard`) as other store shelves; items come from a recommendation campaign (cross-sell, similar items, top sellers, personalized, and related types) instead of a search query.

- **Data source:** VTEX Recommendations BFF, exposed by `@faststore/api` through the `recommendations` GraphQL query.
- **Registration:** global CMS component (`$componentKey: "RecommendationShelf"`), available on any page via CMS.
- **Opt-in via CMS:** enable Recommendations with the **Enable recommendations?** toggle on the shelf (default `false`). No store code changes or feature flags are required.

Recommendations are rendered by two surfaces that share one data layer (`src/sdk/recommendations`):

| Surface | Component | Configured in | Layout |
| --- | --- | --- | --- |
| Page shelf | `RecommendationShelf` | Its own CMS component | Full-width carousel |
| Mini cart shelf | `CartRecommendationShelf` | The **Recommendations** group of the **Cart Sidebar** component | Compact carousel inside the cart drawer |

## Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [CMS configuration](#cms-configuration)
- [Campaign types (VRN) and context](#campaign-types-vrn-and-context)
- [Mini cart shelf](#mini-cart-shelf)
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

## Mini cart shelf

A compact shelf can be rendered **inside the cart drawer**, between the cart items and the order summary. It is the highest-intent cross-sell surface in the store: the shopper has just added an item and the drawer is open.

The CMS cannot nest one section inside another, so this shelf is not a separate CMS component — it is configured as a **Recommendations** group on the **Cart Sidebar** component.

Schema: `cms/faststore/components/cms_component__cartsidebar.jsonc`, under `recommendations`.

| CMS property | Key | Type | Required | Default | Description |
| --- | --- | --- | --- | --- | --- |
| Enable recommendations? | `enableRecommendations` | boolean | No | `false` | Opt-in. Off means no session, no request, nothing rendered. |
| Campaign VRN | `campaignVrn` | string | **Yes** (when the group is used) | — | Same VRN taxonomy and validation as the page shelf. |
| Title | `title` | string | No | — | Overrides the shelf title. Falls back to the campaign title. |
| › Items per page | `carouselConfiguration.itemsPerPage` | number | No | `2` | The drawer is around 340px wide on every breakpoint, so keep this low. Fractional values such as `1.5` hint that the carousel scrolls. |
| › Carousel track variant | `carouselConfiguration.variant` | `slide` \| `scroll` | No | `scroll` | Carousel navigation mode. |
| › Navigation controls | `carouselConfiguration.controls` | `complete` \| `navigationArrows` \| `paginationBullets` | No | `navigationArrows` | Visible navigation controls. |
| › Show discount badge? | `productCardConfiguration.showDiscountBadge` | boolean | No | `true` | Shows the discount badge. |
| › Cards should be bordered? | `productCardConfiguration.bordered` | boolean | No | `false` | Renders bordered cards. |

Differences from the page shelf:

- **The context is always the cart.** There is no `itemsContext` property.
- **The context is frozen while the drawer is open.** Adding a recommended product would otherwise change the campaign context, refetch, and reshuffle the carousel right after the shopper tapped it. Closing and reopening the drawer re-evaluates the context.
- **Taxes are inherited.** The shelf reuses the drawer's own **Taxes Configuration** so recommended products and cart items price alike.
- **It renders on an empty cart too**, which is useful for context-agnostic campaigns. Context-based campaigns have nothing to anchor on and suppress themselves automatically, so no extra configuration is needed.
- **It only fetches when the drawer opens.** The drawer is gated by `SECTIONS_OUT_OF_VIEWPORT`, and the shelf ships in its own chunk, so stores without a mini cart shelf download neither the component nor its styles.

## Runtime behavior

All recommendation work runs client-side after hydration:

1. **Session start (CMS opt-in)** — `Layout` calls `useStartRecommendationSession(pageProps)` once. The hook opts in when the CMS data contains either a `RecommendationShelf` with `enableRecommendations: true` **or** a `CartSidebar` whose `recommendations.enableRecommendations` is `true`, and no-ops when neither is present. Multiple enabled shelves on the same page still start the session only once (in-memory lock + session cookie).
2. **User id resolution** — `useRecommendationUserId()` reads the `vtex-rec-user-id` cookie, retrying until a value is available or the retry budget is exhausted.
3. **Request arguments** — when enabled, `getRecommendationArguments()` builds `{ userId, campaignVrn, products }` or returns `null` when the VRN is invalid, the user id is missing, or a context-based campaign has no context products. When disabled, arguments stay `null`.
4. **Fetch** — `useRecommendations()` runs `ClientRecommendationsQuery` and returns `products`, `correlationId`, and `campaign`.
5. **Render** — shows `ProductShelfSkeleton` while loading; returns `null` on error or empty results; otherwise renders the carousel and optional heading.
6. **Tracking** — when correlation and campaign identifiers are present, the shelf emits `data-af-*` attributes for Activity Flow, using `recommendation-shelf` on the page and `cart-recommendation-shelf` in the drawer so the two surfaces can be attributed separately. PDP product views use `product:*` meta tags from `pages/[slug]/p.tsx`.

Steps 1 to 4 live in `src/sdk/recommendations` behind `useRecommendationShelf()`. Step 5 is owned by `RecommendationShelf`; the mini cart shelf is a thin wrapper around it that locks cart context, freezes context while the drawer is open, and applies drawer-safe carousel/tax defaults — so `ProductCard` / `mapProductToProductCard` work the same way on both surfaces.

Related files:

- Shared data layer: `src/sdk/recommendations/`
- Page shelf (also the presentation used by the mini cart): `src/components/sections/RecommendationShelf/`
- Mini cart wrapper: `src/components/cart/CartRecommendationShelf/`
- Session hook: `src/sdk/analytics/hooks/useStartRecommendationSession.ts`
- Session opt-in scan: `src/sdk/analytics/utils/hasEnabledRecommendationShelf.ts`
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

Campaign types and VRN validation are defined in `src/sdk/recommendations/vrn.ts` (`VRN_TYPE_TO_RECOMMENDATION`). Updates should be made there and mirrored in the `pattern` of both CMS schemas (`cms_component__recommendationshelf.jsonc` and the `recommendations` group of `cms_component__cartsidebar.jsonc`).

The mini cart shelf (`CartRecommendationShelf`) reuses `RecommendationShelf`, so the same `ProductCard` / `mapProductToProductCard` overrides apply. By default it renders `CartRecommendationProductCard`, which adds an **Add to cart** action (first offer / SKU, drawer stays open). Because the drawer is rendered by `CartSidebar` from CMS props, passing a custom card from a store means customizing `CartSidebar` (or `CartRecommendationShelf`) under `src/customizations` and forwarding the override into `recommendations`.

## Placement guidelines

As a global component, the shelf can be placed on any CMS page. Suggested placements by campaign type:

- **Home / institutional pages:** context-agnostic campaigns (top sellers, personalized, last seen, search-based).
- **PDP:** context-based campaigns with `itemsContext: PDP`.
- **Cart:** cross-sell with `itemsContext: CART`.
- **PLP:** context-agnostic campaigns.
- **Cart drawer (mini cart):** cross-sell, configured on the **Cart Sidebar** component. See [Mini cart shelf](#mini-cart-shelf).

The personalization session runs only when at least one shelf — page or mini cart — has **Enable recommendations?** turned on.

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

**The mini cart shelf does not render.** Same checklist, plus:

6. Is the toggle set on the **Cart Sidebar** component (under **Recommendations**), not on a separate Recommendation Shelf? Only that shape opts the drawer in.
7. Is `vtex-rec-user-id` set **before** the drawer opens? The session starts on page load; if the opt-in is not detected the cookie never lands and the shelf silently renders nothing.
8. Is the campaign context-based with an empty cart? That combination is suppressed by design — use a context-agnostic campaign if you want the shelf on an empty cart.

**Skeleton never resolves.** Inspect the console and the GraphQL `recommendations` response for pending or failing requests.

**No tracking events.** Confirm that the Activity Flow script is present and that PDP `product:*` meta tags and shelf `data-af-*` attributes are rendered.
