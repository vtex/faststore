import { BadRequestError } from '../../errors'
import type { QueryRecommendationsArgs } from '../../../__generated__/schema'
import type { GraphqlContext } from '../index'
import { enhanceSku, type EnhancedSku } from '../utils/enhanceSku'
import { pickBestSku } from '../utils/sku'

// Structural check for a recommendations campaign VRN
// (`vrn:recommendations:<account>:<campaign-type>:<campaign-id>`). Kept generic
// on purpose: the authoritative campaign taxonomy lives in `@faststore/core`,
// and `@faststore/api` must not depend on it, so we only validate the shape.
const RECOMMENDATION_VRN_PATTERN = /^vrn:recommendations:[^:]+:[^:]+:[^:]+$/

/**
 * Resolves personalized recommendations for a campaign.
 *
 * The VTEX Recommendations BFF already returns the products fully hydrated in
 * the same Intelligent Search shape used by the `search` query. We map them
 * straight to the normalized `StoreProduct` shape (`pickBestSku` + `enhanceSku`)
 * so recommendation shelves render identical cards to regular shelves, while
 * preserving the recommendation order returned by the BFF.
 */
export const recommendations = async (
  _: unknown,
  { campaignVrn, userId, products }: QueryRecommendationsArgs,
  ctx: GraphqlContext
) => {
  const {
    clients: { commerce },
  } = ctx

  const { salesChannel } = ctx.storage.channel

  // Validate inputs server-side so only clean, well-formed payloads reach the
  // Recommendations BFF (see @faststore/api server-side validation principle).
  const normalizedCampaignVrn = campaignVrn?.trim()
  if (
    !normalizedCampaignVrn ||
    !RECOMMENDATION_VRN_PATTERN.test(normalizedCampaignVrn)
  ) {
    throw new BadRequestError(`Invalid campaignVrn: "${campaignVrn}"`)
  }

  const normalizedUserId = userId?.trim()
  if (userId != null && !normalizedUserId) {
    throw new BadRequestError('Invalid userId: must be a non-empty string')
  }

  if (
    products != null &&
    (!Array.isArray(products) || products.some((product) => !product?.trim()))
  ) {
    throw new BadRequestError(
      'Invalid products: must be an array of non-empty strings'
    )
  }

  const response = await commerce.recommendation.recommendations({
    campaignVrn: normalizedCampaignVrn,
    userId: normalizedUserId || undefined,
    products: products ?? [],
    salesChannel: salesChannel ?? undefined,
    locale: ctx.storage.locale,
  })

  const { campaign, correlationId } = response

  const orderedProducts = (response.products ?? [])
    .map((product) => {
      const sku = pickBestSku(product.items)

      return sku ? enhanceSku(sku, product) : null
    })
    .filter((sku): sku is EnhancedSku => Boolean(sku))

  return {
    products: orderedProducts,
    correlationId,
    campaign,
  }
}
