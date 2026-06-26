import type { ComponentType } from 'react'

import type { CarouselProps } from '@faststore/ui'
import type { ProductSummary_ProductFragment } from '@generated/graphql'

import type { ProductCardProps } from 'src/components/product/ProductCard'

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
  title?: string
  campaignVrn: string
  /**
   * Custom card component rendered for each recommended product. Defaults to the
   * core `ProductCard`. This is a code-level override and is not exposed through
   * the CMS schema (`cms_component__RecommendationShelf.jsonc`).
   */
  ProductCard?: ComponentType<TCardProps>
  /**
   * Maps a recommendation product into the props of the card component. Defaults
   * to passing the product through as `{ product, index, ...productCardConfiguration }`.
   * When provided, this mapper is fully responsible for the card props (the
   * default `productCardConfiguration` merge no longer applies). This is a
   * code-level override and is not exposed through the CMS schema.
   */
  mapProductToProductCard?: RecommendationProductCardMapper<TCardProps>
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
