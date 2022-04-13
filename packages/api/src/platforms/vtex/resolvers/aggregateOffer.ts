import type {
  CommertialOffer,
  Item,
  Seller,
} from '../clients/search/types/ProductSearchResult'
import type { StoreProduct } from './product'
import type { PromiseType } from '../../../typings'
import type { Resolver } from '..'
import type { EnhancedSku } from '../utils/enhanceSku'
import { inStock } from '../utils/productStock'

type Root = PromiseType<ReturnType<typeof StoreProduct.offers>>

const highestPriceReducer = (priceType: keyof CommertialOffer) => (
  priceResult: number,
  seller: Seller
) =>
  seller.commertialOffer.ListPrice > priceResult
    ? seller.commertialOffer[priceType]
    : priceResult

export const StoreAggregateOffer: Record<string, Resolver<Root>> & {
  offers: Resolver<Root, any, Array<Item & { product: EnhancedSku }>>
} = {
  highPrice: ({ items }) => {
    const decreaseComparator = (a: number, b: number) => (a > b ? -1 : 1)

    const availableItemsPrice = items
      .filter(inStock)
      .map((item) => item.sellers.reduce(highestPriceReducer('ListPrice'), 0))
      .sort(decreaseComparator)

    return availableItemsPrice[0] ?? 0
  },
  lowPrice: ({ items }) => {
    const increaseComparator = (a: number, b: number) => (a < b ? -1 : 1)
    const availableItemsPrice = items
      .filter(inStock)
      .map((item) => item.sellers.reduce(highestPriceReducer('Price'), 0))
      .sort(increaseComparator)

    return availableItemsPrice[0] ?? 0
  },
  offerCount: ({ items }) => items.length,
  priceCurrency: () => '',
  offers: ({ items, product }) =>
    items.map((item) => ({
      ...item,
      product,
    })),
}
