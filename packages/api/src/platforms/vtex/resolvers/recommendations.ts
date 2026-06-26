import type { QueryRecommendationsArgs } from '../../../__generated__/schema'
import type { GraphqlContext } from '../index'
import { enhanceSku, type EnhancedSku } from '../utils/enhanceSku'
import { pickBestSku } from '../utils/sku'

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
    clients: { recommendation },
  } = ctx

  const { salesChannel } = ctx.storage.channel

  const response = await recommendation.recommendations({
    campaignVrn,
    userId: userId ?? undefined,
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
