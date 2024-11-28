import useSWR from 'swr'
import { aggregateOffer } from './aggregate'
import { enhanceCommercialOffer } from './enhance'
import { fetcher } from './fetcher'
import { bestOfferFirst } from './sort'
export { fetcher as fetcherOffer, getUrl as getOfferUrl } from './fetcher'

const ERROR_DATA = { offers: {}, isValidating: false }

export function useOffer(args: { skuId: string }) {
  const { data, error, isValidating } = useSWR(args.skuId, fetcher)

  if (error || !data || data.products.length === 0) {
    console.warn('Error or no data fetching offer to SKU', args.skuId, error)
    return ERROR_DATA
  }

  const product = data.products[0]

  if (!product || product.items.length === 0) {
    console.warn('Product not found or has no items for SKU', args.skuId)
    return ERROR_DATA
  }

  const item = product.items.find((item) => item.itemId === args.skuId)

  if (!item) {
    console.warn('Item not found for SKU', args.skuId)
    return ERROR_DATA
  }

  const sellers = item.sellers
    .map((seller) =>
      enhanceCommercialOffer({
        offer: seller.commertialOffer,
        seller,
        product: item,
      })
    )
    .sort(bestOfferFirst)

  const offers = aggregateOffer(sellers)

  return { offers, isValidating }
}
