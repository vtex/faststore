import type { CarouselProps } from '@faststore/ui'
import type {
  ProductSummary_ProductFragment,
  RecommendationProduct,
} from '@generated/graphql'

/**
 * Maps a `RecommendationProduct` into the `ProductCard` data shape.
 * Implemented by `mapRecommendationToProductCard` and overridable per shelf.
 */
export type RecommendationProductCardMapper = (
  product: RecommendationProduct
) => ProductSummary_ProductFragment

export type RecommendationShelfProps = {
  title?: string
  campaignVrn: string
  /**
   * Maps a recommendation product into the `ProductCard` data shape. Defaults to
   * `mapRecommendationToProductCard`. This is a code-level override and is not
   * exposed through the CMS schema (`cms_component__RecommendationShelf.jsonc`).
   */
  mapProductToProductCard?: RecommendationProductCardMapper
  /**
   * Forwarded to the underlying `Carousel`. `id` stays controlled by the shelf.
   * `itemsPerPage` is derived from `itemsPerPageDesktop`/`itemsPerPageMobile`
   * based on the viewport.
   */
  carouselConfiguration?: Pick<
    CarouselProps,
    'infiniteMode' | 'variant' | 'controls'
  > & {
    /**
     * Number of items per page on desktop viewports.
     * @default 4
     */
    itemsPerPageDesktop?: number
    /**
     * Number of items per page on mobile viewports.
     * @default 2
     */
    itemsPerPageMobile?: number
  }
  /**
   * Forwarded to each `ProductCard` rendered by the shelf.
   */
  productCardConfiguration?: {
    showDiscountBadge?: boolean
    bordered?: boolean
  }
}

export type RecommendationType =
  | 'CROSS_SELL'
  | 'SIMILAR_ITEMS'
  | 'PERSONALIZED'
  | 'TOP_ITEMS'
  | 'LAST_SEEN'
  | 'SEARCH_BASED'
  | 'VISUAL_SIMILARITY'
  | 'NEXT_INTERACTION'
