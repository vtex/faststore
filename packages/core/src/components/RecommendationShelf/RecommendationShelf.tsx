import React, { useId, useMemo, useState } from 'react'

import { usePDP } from '@faststore/core'
import { ProductShelf, Carousel } from '@faststore/ui'

import ProductCard from 'src/components/product/ProductCard'
import ProductShelfSkeleton from 'src/components/skeletons/ProductShelfSkeleton'

import { mapRecommendationToProductCard } from './mapRecommendationToProductCard'
import type { RecommendationShelfProps } from './RecommendationShelf.types'
import styles from './RecommendationShelf.module.scss'
import {
  useRecommendations,
  type RecommendationInput,
} from './useRecommendations'
import { checkIsMobile, getUserIdFromCookie, getWithRetry } from './utils'
import { getTypeFromVrn } from './vrn'

function getRecommendationArguments(
  campaignVrn: string,
  context: { userId?: string | null; pdpProduct?: string }
): RecommendationInput | null {
  const { userId, pdpProduct } = context
  const type = getTypeFromVrn(campaignVrn)

  if (!userId) return null

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
}: RecommendationShelfProps) => {
  const id = useId()
  const isMobile = checkIsMobile()
  const itemsPerPage = isMobile ? 2 : 4
  const [userId, setUserId] = useState<string | null | undefined>(undefined)

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

  if (!userId) {
    // The pixel might take a while to load and set the userId cookie,
    // so we use a retry mechanism to ensure we get the userId if available.
    getWithRetry<string>(() => {
      if (!userId) {
        return getUserIdFromCookie()
      }

      return ''
    })
      .then((value) => {
        setUserId(value)
      })
      .catch((error) => {
        console.error('Error retrieving userId from cookie', error, campaignVrn)
        setUserId(null)
      })
  }

  if (error) {
    console.error(
      'Error fetching recommendations',
      error.cause,
      error.message,
      'with args',
      recommendationArgs
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
          >
            {items.map((item, index) => (
              <div
                key={item.productId}
                className={styles.recommendationShelfItem}
              >
                <ProductCard
                  key={item.productId}
                  product={mapRecommendationToProductCard(item)}
                  index={index}
                  showDiscountBadge
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
                />
              </div>
            ))}
          </Carousel>
        </ProductShelf>
      </ProductShelfSkeleton>
    </section>
  )
}
