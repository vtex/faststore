import type { Item } from '../clients/search/types/ProductSearchResult'
import type { StoreProduct } from './product'
import type { PromiseType } from '../../../typings'
import type { Resolver } from '..'
import type { EnhancedSku } from '../utils/enhanceSku'
import { inStock } from '../utils/productStock'
import { getItemPriceByKey } from '../utils/price'

type Root = PromiseType<ReturnType<typeof StoreProduct.offers>>

const getItemPrice = (item: Item) => getItemPriceByKey(item, 'Price')

export const StoreAggregateOffer: Record<string, Resolver<Root>> & {
  offers: Resolver<Root, any, Array<Item & { product: EnhancedSku }>>
} = {
  highPrice: ({ items }) => {
    const availableItems = items.filter(inStock)
    const highPrice =
      availableItems.length > 0
        ? getItemPrice(availableItems[availableItems.length - 1])
        : 0

    return highPrice
  },
  lowPrice: ({ items }) => {
    const availableItems = items.filter(inStock)
    const lowPrice =
      availableItems.length > 0 ? getItemPrice(availableItems[0]) : 0

    return lowPrice
  },
  offerCount: ({ items }) => items.length,
  priceCurrency: () => '',
  offers: ({ items, product }) =>
    items.map((item) => ({
      ...item,
      product,
    })),
}
