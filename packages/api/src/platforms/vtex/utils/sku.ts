import { min } from './orderStatistics'
import { bestOfferFirst } from './productStock'
import type { Item } from '../clients/search/types/ProductSearchResult'

/**
 * This function implements Portal heuristics for returning the best sku for a product.
 *
 * The best sku is the one with the best (cheapest available) offer
 * */
export const pickBestSku = (skus: Item[]) => {
  const offersBySku = skus.flatMap((sku) =>
    sku.sellers.map((seller) => ({
      offer: seller.commertialOffer,
      sku,
    }))
  )

  const best = min(offersBySku, ({ offer: o1 }, { offer: o2 }) =>
    bestOfferFirst(o1, o2)
  )

  return best ? best.sku : skus[0]
}

export const isValidSkuId = (skuId: string) =>
  skuId !== '' && !Number.isNaN(Number(skuId))
