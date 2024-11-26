import useSWR from 'swr'
import { aggregateOffer } from './aggregate'
import { enhanceCommercialOffer } from './enhance'
import { fetcher } from './fetcher'
import { bestOfferFirst } from './sort'

export function useOffer(args: { skuId: string }) {
  const { data, error, isValidating } = useSWR(args.skuId, fetcher)

  if (error) {
    console.warn('Error fetching offer to SKU', args.skuId, error)
  }

  if (!data) {
    return { offers: {}, isValidating }
  }

  if (data.products.length === 0) {
    console.warn('Product not found for SKU', args.skuId)
  }

  const [product] = data.products

  if (product.items.length === 0) {
    console.warn('Product has no items', product)
  }

  const item = product.items.find((item) => item.itemId === args.skuId)

  if (!item) {
    console.warn('Item not found for SKU', args.skuId)
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
