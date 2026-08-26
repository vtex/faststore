import type { CarouselProps } from '@faststore/ui'
import type { ProductSummary_ProductFragment } from '@generated/graphql'

import type { ProductCardProps } from 'src/components/product/ProductCard'
import {
  RecommendationShelf,
  type RecommendationProductCardMapper,
  type RecommendationShelfProps,
} from 'src/components/sections/RecommendationShelf'

import CartRecommendationProductCard from './CartRecommendationProductCard'
import styles from './CartRecommendationShelf.module.scss'

export type CartRecommendationShelfProps<
  TCardProps extends object = ProductCardProps,
> = Omit<
  RecommendationShelfProps<TCardProps>,
  | 'itemsContext'
  | 'freezeContext'
  | 'className'
  | 'afElement'
  | 'carouselConfiguration'
> & {
  /**
   * Drawer-safe carousel configuration. Mapped onto
   * `RecommendationShelf`'s desktop/mobile paging props (the drawer is the
   * same width on every breakpoint, so both viewports share this count).
   */
  readonly carouselConfiguration?: {
    /**
     * Products visible at once. Fractional values (e.g. `1.5`) hint that the
     * carousel scrolls.
     * @default 1
     */
    readonly itemsPerPage?: number
    /** @default 'scroll' */
    readonly variant?: CarouselProps['variant']
    /** @default false */
    readonly infiniteMode?: CarouselProps['infiniteMode']
    /** @default 'navigationArrows' */
    readonly controls?: CarouselProps['controls']
  }
  /**
   * Forwarded from the cart drawer so recommended products display prices under
   * the same tax rules as the cart items next to them. Applied through the
   * default `mapProductToProductCard`; a custom mapper is responsible for
   * forwarding it itself.
   */
  readonly taxesConfiguration?: ProductCardProps['taxesConfiguration']
}

/**
 * Compact recommendation shelf for the cart drawer.
 *
 * Presentation is owned by `RecommendationShelf` so code-level overrides
 * (`ProductCard`, `mapProductToProductCard`, …) work the same way as on the
 * page shelf. This wrapper only locks cart-specific behaviour: cart context,
 * frozen context while the drawer stays open, drawer-safe carousel defaults,
 * Activity Flow attribution, tax/image sizing for the narrow panel, and the
 * default `CartRecommendationProductCard` (add-to-cart without reopening the
 * drawer).
 */
function CartRecommendationShelf<TCardProps extends object = ProductCardProps>({
  title,
  campaignVrn,
  enableRecommendations = false,
  carouselConfiguration,
  productCardConfiguration,
  taxesConfiguration,
  ProductCard,
  mapProductToProductCard,
}: CartRecommendationShelfProps<TCardProps>) {
  const {
    itemsPerPage = 1,
    variant = 'scroll',
    infiniteMode = false,
    controls = 'navigationArrows',
  } = carouselConfiguration ?? {}

  const mapToCardProps: RecommendationProductCardMapper<TCardProps> =
    mapProductToProductCard ??
    ((product: ProductSummary_ProductFragment, index: number) =>
      ({
        product,
        index,
        bordered: productCardConfiguration?.bordered ?? false,
        showDiscountBadge: productCardConfiguration?.showDiscountBadge ?? true,
        taxesConfiguration,
        imgProps: { sizes: '(max-width: 768px) 45vw, 15vw' },
      }) as TCardProps)

  return (
    <RecommendationShelf<TCardProps>
      title={title}
      campaignVrn={campaignVrn}
      enableRecommendations={enableRecommendations}
      itemsContext="CART"
      freezeContext
      className={styles.shelf}
      afElement="cart-recommendation-shelf"
      ProductCard={
        (ProductCard ??
          CartRecommendationProductCard) as RecommendationShelfProps<TCardProps>['ProductCard']
      }
      mapProductToProductCard={mapToCardProps}
      productCardConfiguration={productCardConfiguration}
      carouselConfiguration={{
        itemsPerPageDesktop: itemsPerPage,
        itemsPerPageMobile: itemsPerPage,
        variant,
        infiniteMode,
        controls,
      }}
    />
  )
}

export default CartRecommendationShelf
