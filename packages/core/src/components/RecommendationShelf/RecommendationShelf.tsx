import { useId, useMemo } from 'react'

import { usePDP } from '@faststore/core'
import { ProductShelf, Carousel } from '@faststore/ui'

import ProductCard from 'src/components/product/ProductCard'
import ProductShelfSkeleton from 'src/components/skeletons/ProductShelfSkeleton'
import useScreenResize from 'src/sdk/ui/useScreenResize'

import { mapRecommendationToProductCard } from './mapRecommendationToProductCard'
import type { RecommendationShelfProps } from './RecommendationShelf.types'
import styles from './RecommendationShelf.module.scss'
import {
  useRecommendations,
  type RecommendationInput,
} from './useRecommendations'
import { useRecommendationUserId } from './useRecommendationUserId'
import { getTypeFromVrn } from './vrn'

function getRecommendationArguments(
  campaignVrn: string,
  context: { userId?: string | null; pdpProduct?: string }
): RecommendationInput | null {
  const { userId, pdpProduct } = context
  const type = getTypeFromVrn(campaignVrn)

  // `type` is null for malformed/unknown VRNs; bail out so we never fetch (and
  // never throw) on an invalid campaign coming from the CMS.
  if (!type || !userId) return null

  switch (type) {
    case 'NEXT_INTERACTION':
    case 'VISUAL_SIMILARITY':
    case 'CROSS_SELL':
    case 'SIMILAR_ITEMS':
      if (!pdpProduct) {
        return null
      }
      return {
        userId,
        campaignVrn,
        products: [pdpProduct],
      }
    default:
      return {
        userId,
        campaignVrn,
        products: [],
      }
  }
}

export const RecommendationShelf = ({
  title,
  campaignVrn,
  mapProductToProductCard = mapRecommendationToProductCard,
  carouselConfiguration,
  productCardConfiguration,
}: RecommendationShelfProps) => {
  const id = useId()
  const { isMobile, isTablet } = useScreenResize()
  const {
    itemsPerPageDesktop = 4,
    itemsPerPageMobile = 2,
    ...carouselProps
  } = carouselConfiguration ?? {}
  // Treat mobile and tablet viewports (<= 768px) as "mobile" for paging, which
  // matches the carousel layout the shelf was designed around.
  const itemsPerPage =
    isMobile || isTablet ? itemsPerPageMobile : itemsPerPageDesktop

  const userId = useRecommendationUserId(campaignVrn)

  const { data: productDetailPage } = usePDP()

  const recommendationArgs = getRecommendationArguments(campaignVrn, {
    userId,
    pdpProduct: productDetailPage?.product.isVariantOf.productGroupID,
  })

  const { data, isLoading, error } = useRecommendations(recommendationArgs)

  const items = data?.products || []
  const correlationId = data?.correlationId
  const campaignId = data?.campaign.id

  const productIds = useMemo(
    () => items.map((p) => p.productId).join(', '),
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
    return <></>
  }

  return (
    <section
      className={`${styles.recommendationShelf} section-product-shelf layout__section section`}
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
            variant="scroll"
            infiniteMode={false}
            {...carouselProps}
          >
            {items.map((item, index) => (
              <div
                key={item.productId}
                className={styles.recommendationShelfItem}
                {...(shouldAddAFAttr
                  ? {
                      'data-af-element': 'recommendation-shelf-product',
                      'data-af-correlation-id': correlationId,
                      'data-af-campaign-id': campaignId,
                      'data-af-product-id': item.productId,
                      'data-af-onclick': !!item.productId,
                      'data-af-product-position': index + 1,
                    }
                  : {})}
              >
                <ProductCard
                  product={mapProductToProductCard(item)}
                  index={index}
                  {...productCardConfiguration}
                />
              </div>
            ))}
          </Carousel>
        </ProductShelf>
      </ProductShelfSkeleton>
    </section>
  )
}
