import { type ComponentType, useId, useMemo } from 'react'

import { usePDP } from '@faststore/core'
import { ProductShelf, Carousel } from '@faststore/ui'
import type { ProductSummary_ProductFragment } from '@generated/graphql'

import storeConfig from 'discovery.config'

import DefaultProductCard, {
  type ProductCardProps,
} from 'src/components/product/ProductCard'
import ProductShelfSkeleton from 'src/components/skeletons/ProductShelfSkeleton'
import { useCart } from 'src/sdk/cart'
import useScreenResize from 'src/sdk/ui/useScreenResize'

import type {
  RecommendationProductCardMapper,
  RecommendationShelfProps,
} from './RecommendationShelf.types'
import styles from './section.module.scss'
import {
  useRecommendations,
  type RecommendationInput,
} from './useRecommendations'
import { useRecommendationUserId } from './useRecommendationUserId'
import { getTypeFromVrn } from './vrn'

function getRecommendationArguments(
  campaignVrn: string,
  context: { userId?: string | null; contextProducts: string[] }
): RecommendationInput | null {
  const { userId, contextProducts } = context
  const type = getTypeFromVrn(campaignVrn)

  // `type` is null for malformed/unknown VRNs; bail out so we never fetch (and
  // never throw) on an invalid campaign coming from the CMS.
  if (!type || !userId) return null

  switch (type) {
    case 'NEXT_INTERACTION':
    case 'VISUAL_SIMILARITY':
    case 'CROSS_SELL':
    case 'SIMILAR_ITEMS':
      // These campaigns need product context. Without any (e.g. `CART` context
      // on an empty cart, or `PDP` context outside a product page), skip the
      // fetch instead of requesting recommendations we can't anchor.
      if (contextProducts.length === 0) {
        return null
      }
      return {
        userId,
        campaignVrn,
        products: contextProducts,
      }
    default:
      return {
        userId,
        campaignVrn,
        products: [],
      }
  }
}

export function RecommendationShelf<
  TCardProps extends object = ProductCardProps,
>({
  title,
  campaignVrn,
  itemsContext = 'PDP',
  ProductCard,
  mapProductToProductCard,
  carouselConfiguration,
  productCardConfiguration,
}: Readonly<RecommendationShelfProps<TCardProps>>) {
  const {
    itemsPerPageDesktop = 4,
    itemsPerPageMobile = 2,
    variant = 'scroll',
    infiniteMode = false,
    controls,
  } = carouselConfiguration ?? {}

  const CardComponent = (ProductCard ??
    DefaultProductCard) as ComponentType<TCardProps>

  const mapToCardProps = (mapProductToProductCard ??
    ((product: ProductSummary_ProductFragment, index: number) => ({
      product,
      index,
      ...productCardConfiguration,
    }))) as RecommendationProductCardMapper<TCardProps>

  const id = useId()
  const { isMobile, isTablet } = useScreenResize()
  // Treat mobile and tablet viewports (<= 768px) as "mobile" for paging, which
  // matches the carousel layout the shelf was designed around.
  const itemsPerPage =
    isMobile || isTablet ? itemsPerPageMobile : itemsPerPageDesktop

  const userId = useRecommendationUserId(campaignVrn)

  const { data: productDetailPage } = usePDP()
  const { items: cartItems } = useCart()

  // Resolve the products used as context for the request from the configured
  // source: the current PDP product, or the (deduplicated) cart items.
  const contextProducts = useMemo(() => {
    if (itemsContext === 'CART') {
      return Array.from(
        new Set(
          cartItems
            .map((item) => item.itemOffered.isVariantOf.productGroupID)
            .filter(Boolean)
        )
      )
    }

    const pdpProduct = productDetailPage?.product.isVariantOf.productGroupID

    return pdpProduct ? [pdpProduct] : []
  }, [itemsContext, cartItems, productDetailPage])

  // Gate the whole feature behind the opt-in flag: when Recommendations is
  // disabled the shelf never requests recommendations (nor renders).
  const recommendationArgs = storeConfig.experimental.enableRecommendations
    ? getRecommendationArguments(campaignVrn, {
        userId,
        contextProducts,
      })
    : null

  const { data, isLoading, error } = useRecommendations(recommendationArgs)

  const items = data?.products || []
  const correlationId = data?.correlationId
  const campaignId = data?.campaign.id

  const productIds = useMemo(
    () => items.map((p) => p.isVariantOf.productGroupID).join(', '),
    [items]
  )

  const shouldAddAFAttr = !!(
    !isLoading &&
    correlationId &&
    campaignId &&
    productIds.length
  )

  if (error) {
    // Don't log `recommendationArgs`: it carries the userId. Log only
    // non-identifying context.
    console.error(
      'Error fetching recommendations',
      error.cause,
      error.message,
      'for campaign',
      campaignVrn
    )
    return null
  }

  if (!isLoading && items.length === 0) {
    return null
  }

  return (
    <section
      className={`${styles.section} section-product-shelf layout__section section`}
      {...(shouldAddAFAttr
        ? {
            'data-af-element': 'recommendation-shelf' as const,
            'data-af-onimpression': true,
            'data-af-onview': true,
            'data-af-correlation-id': correlationId,
            'data-af-campaign-id': campaignId,
            'data-af-products': productIds,
          }
        : {})}
    >
      <ProductShelfSkeleton loading={isLoading} itemsPerPage={itemsPerPage}>
        <h2 className="text__title-section layout__content">
          {title ?? data?.campaign.title}
        </h2>
        <ProductShelf>
          <Carousel
            id={id}
            itemsPerPage={itemsPerPage}
            variant={variant}
            infiniteMode={infiniteMode}
            controls={controls}
          >
            {items.map((item, index) => {
              const productId = item.isVariantOf.productGroupID

              return (
                <div
                  key={item.id}
                  data-fs-recommendation-shelf-item
                  {...(shouldAddAFAttr
                    ? {
                        'data-af-element': 'recommendation-shelf-product',
                        'data-af-correlation-id': correlationId,
                        'data-af-campaign-id': campaignId,
                        'data-af-product-id': productId,
                        'data-af-onclick': !!productId,
                        'data-af-product-position': index + 1,
                      }
                    : {})}
                >
                  <CardComponent {...mapToCardProps(item, index)} />
                </div>
              )
            })}
          </Carousel>
        </ProductShelf>
      </ProductShelfSkeleton>
    </section>
  )
}
