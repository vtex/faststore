import { usePDP } from '@faststore/core'
import { useMemo } from 'react'

import { useStartRecommendationSession } from 'src/sdk/analytics/hooks/useStartRecommendationSession'
import { useCart } from 'src/sdk/cart'

import type { ItemContext } from './types'
import {
  type RecommendationInput,
  type RecommendationResponse,
  useRecommendations,
} from './useRecommendations'
import { useRecommendationUserId } from './useRecommendationUserId'
import { getTypeFromVrn } from './vrn'

export function getRecommendationArguments(
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

export type UseRecommendationShelfArgs = {
  readonly campaignVrn: string
  /**
   * Where to read the products used as context for the recommendation request.
   * @default 'PDP'
   */
  readonly itemsContext?: ItemContext
}

export type UseRecommendationShelfResult = {
  readonly items: RecommendationResponse['products']
  readonly isLoading: boolean
  readonly error: unknown
  readonly campaign?: RecommendationResponse['campaign']
  readonly correlationId?: string
}

const EMPTY_ITEMS: RecommendationResponse['products'] = []

/**
 * Headless data layer behind every recommendation shelf: resolves the campaign
 * type, the anonymous user id and the product context, then fetches the
 * campaign. It renders nothing — presentation lives in the shelf components
 * that consume it, so a new surface can reuse the campaign rules instead of
 * reimplementing them.
 *
 * When `userId` is missing (`undefined` or `null`), starts the personalization
 * session as a fallback in parallel with cookie retry (Layout already starts
 * it when `experimental.enableRecommendations` is on). Cookie + in-memory lock
 * keep the mutation to one attempt per browser session.
 */
export function useRecommendationShelf({
  campaignVrn,
  itemsContext = 'PDP',
}: UseRecommendationShelfArgs): UseRecommendationShelfResult {
  const userId = useRecommendationUserId(campaignVrn)

  // Fallback when Layout did not start the session (flag off): start in
  // parallel with cookie lookup. `undefined` and `null` both mean no id yet;
  // waiting for `null` exhausts the retry budget before the mutation can set
  // `vtex-rec-user-id`, so the first page would never fetch. Cookie + lock
  // already no-op when a session exists.
  useStartRecommendationSession(!userId)

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

    const pdpProduct = productDetailPage?.product?.isVariantOf?.productGroupID

    return pdpProduct ? [pdpProduct] : []
  }, [itemsContext, cartItems, productDetailPage])

  const recommendationArgs = getRecommendationArguments(campaignVrn, {
    userId,
    contextProducts,
  })

  const { data, isLoading, error } = useRecommendations(recommendationArgs)

  if (error) {
    // Don't log `recommendationArgs`: it carries the userId. Log only
    // non-identifying context.
    console.error(
      'Error fetching recommendations',
      (error as { cause?: unknown })?.cause,
      (error as { message?: string })?.message,
      'for campaign',
      campaignVrn
    )
  }

  return {
    items: error ? EMPTY_ITEMS : (data?.products ?? EMPTY_ITEMS),
    isLoading,
    error,
    campaign: data?.campaign,
    correlationId: data?.correlationId,
  }
}
