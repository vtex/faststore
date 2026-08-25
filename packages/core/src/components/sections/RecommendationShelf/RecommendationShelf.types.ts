import type { ComponentType } from 'react'

import type { CarouselProps } from '@faststore/ui'
import type { ProductSummary_ProductFragment } from '@generated/graphql'

import type { ProductCardProps } from 'src/components/product/ProductCard'
import type { ItemContext } from 'src/sdk/recommendations'

export type { ItemContext, RecommendationType } from 'src/sdk/recommendations'

/**
 * Maps a recommendation product (a normalized `StoreProduct`, identical to the
 * search response consumed by the rest of the shelves) into the props passed to
 * the card component. Defaults to identity (`(product, index) => ({ product,
 * index })`). Override it — typically together with `ProductCard` — to render
 * custom cards that read additional/personalized fields.
 */
export type RecommendationProductCardMapper<TCardProps = ProductCardProps> = (
  product: ProductSummary_ProductFragment,
  index: number
) => TCardProps

export type RecommendationShelfProps<
  TCardProps extends object = ProductCardProps,
> = {
  readonly title?: string
  readonly campaignVrn: string
  /**
   * Opt-in for VTEX Recommendations on this shelf. When `true`, Layout starts
   * the personalization session (`useStartRecommendationSession`) and this
   * shelf fetches recommendations. When `false` (default), neither happens.
   * @default false
   */
  readonly enableRecommendations?: boolean
  /**
   * Where to read the products used as context for the recommendation request:
   * - `'PDP'`: the current product detail page product.
   * - `'CART'`: the products currently in the cart (useful for cross-sell on the
   *   cart page).
   *
   * Only affects campaigns that require product context (cross-sell, similar
   * items, visual similarity, next interaction). Context-agnostic campaigns
   * (top items, personalized, last seen, search-based) ignore it.
   * @default 'PDP'
   */
  readonly itemsContext?: ItemContext
  /**
   * Keeps the resolved context products stable for the lifetime of the shelf
   * instead of tracking the live cart/PDP context. Used by the cart drawer so
   * adding a recommended product does not reshuffle the carousel.
   * @default false
   */
  readonly freezeContext?: boolean
  /**
   * Replaces the default page-section class list. Surfaces like the cart drawer
   * pass their own module class so the shelf does not pick up full-page layout
   * utilities (`section-product-shelf`, `layout__section`, …).
   */
  readonly className?: string
  /**
   * Activity Flow element name for the shelf root (product items append
   * `-product`). Defaults to `recommendation-shelf`; the cart drawer uses
   * `cart-recommendation-shelf` so the two surfaces can be attributed separately.
   * @default 'recommendation-shelf'
   */
  readonly afElement?: string
  /**
   * Custom card component rendered for each recommended product. Defaults to the
   * core `ProductCard`. This is a code-level override and is not exposed through
   * the CMS schema (`cms_component__recommendationshelf.jsonc`).
   */
  readonly ProductCard?: ComponentType<TCardProps>
  /**
   * Maps a recommendation product into the props of the card component. Defaults
   * to passing the product through as `{ product, index, ...productCardConfiguration }`.
   * When provided, this mapper is fully responsible for the card props (the
   * default `productCardConfiguration` merge no longer applies). This is a
   * code-level override and is not exposed through the CMS schema.
   */
  readonly mapProductToProductCard?: RecommendationProductCardMapper<TCardProps>
  /**
   * Carousel behaviour and paging configuration. Forwarded to the underlying
   * `Carousel`.
   */
  readonly carouselConfiguration?: {
    /**
     * Number of items per page on desktop viewports. Forwarded to the
     * underlying `Carousel` as `itemsPerPage` when the viewport is desktop.
     * @default 4
     */
    readonly itemsPerPageDesktop?: number
    /**
     * Number of items per page on mobile and tablet viewports. Forwarded to the
     * underlying `Carousel` as `itemsPerPage` when the viewport is mobile/tablet.
     * @default 2
     */
    readonly itemsPerPageMobile?: number
    /**
     * How the carousel navigates between items. Forwarded to the underlying
     * `Carousel`.
     * @default 'scroll'
     */
    readonly variant?: CarouselProps['variant']
    /**
     * Enables infinite navigation (only applies to the `slide` variant).
     * Forwarded to the underlying `Carousel`.
     * @default false
     */
    readonly infiniteMode?: CarouselProps['infiniteMode']
    /**
     * Which navigation elements are visible. Forwarded to the underlying
     * `Carousel`.
     */
    readonly controls?: CarouselProps['controls']
  }
  /**
   * Forwarded to each `ProductCard` rendered by the shelf.
   */
  readonly productCardConfiguration?: {
    readonly showDiscountBadge?: boolean
    readonly bordered?: boolean
  }
}
