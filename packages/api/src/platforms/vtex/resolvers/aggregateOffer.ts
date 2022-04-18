import type { Item } from '../clients/search/types/ProductSearchResult'
import type { StoreProduct } from './product'
import type { PromiseType } from '../../../typings'
import type { Resolver } from '..'
import type { EnhancedSku } from '../utils/enhanceSku'

type Root = PromiseType<ReturnType<typeof StoreProduct.offers>>

export const StoreAggregateOffer: Record<string, Resolver<Root>> & {
  offers: Resolver<Root, any, Array<Item & { product: EnhancedSku }>>
} = {
  highPrice: ({ product }) =>
    product.isVariantOf.priceRange.sellingPrice.highPrice,
  lowPrice: ({ product }) =>
    product.isVariantOf.priceRange.sellingPrice.lowPrice,
  offerCount: ({ items }) => items.length,
  priceCurrency: () => '',
  offers: ({ items, product }) =>
    items.map((item) => ({
      ...item,
      product,
    })),
}
