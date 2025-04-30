import useSWR from 'swr'
import { aggregateOffer } from './aggregate'
import { enhanceCommercialOffer } from './enhance'
import { fetcher, getUrl } from './fetcher'
import { bestOfferFirst } from './sort'
import type { ProductSearchResult } from '@faststore/api'
export { getUrl as getOfferUrl } from './fetcher'

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

interface GetOfferArgs {
  skuId: string
}

export async function getOffer(args: GetOfferArgs) {
  const { skuId } = args

  try {
    const url = getUrl(skuId)
    const res = await fetch(url, { next: { tags: [`offer/${skuId}`] } })
    const data: ProductSearchResult = await res.json()

    if (!data || data.products.length === 0) {
      console.warn('No data fetching offer to SKU', skuId)
      return ERROR_DATA
    }

    const product = data.products[0]

    if (!product || product.items.length === 0) {
      console.warn('Product not found or has no items for SKU', skuId)
      return ERROR_DATA
    }

    const item = product.items.find((item) => item.itemId === skuId)

    if (!item) {
      console.warn('Item not found for SKU', skuId)
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

    return {
      offers,
      isValidating: false,
    }
  } catch (error) {
    console.warn('Error data fetching offer to SKU', skuId, error)
    return ERROR_DATA
  }
}
