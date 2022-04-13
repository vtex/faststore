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

const priceReducerByKey = (
  priceType: keyof CommertialOffer,
  priceComparator: (newPrice: number, currentPrice: number) => boolean
) => (priceResult: number, seller: Seller) =>
  priceComparator(seller.commertialOffer.ListPrice, priceResult)
    ? seller.commertialOffer[priceType]
    : priceResult

export const StoreAggregateOffer: Record<string, Resolver<Root>> & {
  offers: Resolver<Root, any, Array<Item & { product: EnhancedSku }>>
} = {
  highPrice: ({ items }) => {
    const decreaseComparator = (a: number, b: number) => (a > b ? -1 : 1)

    const availableItemsPrice = items
      .filter(inStock)
      .map((item) =>
        item.sellers.reduce(
          priceReducerByKey(
            'ListPrice',
            (newPrice, current) => newPrice > current
          ),
          0
        )
      )
      .sort(decreaseComparator)

    return availableItemsPrice[0] ?? 0
  },
  lowPrice: ({ items }) => {
    const increaseComparator = (a: number, b: number) => (a < b ? -1 : 1)
    const availableItemsPrice = items
      .filter(inStock)
      .map((item) =>
        item.sellers.reduce(
          priceReducerByKey('Price', (newPrice, current) => newPrice < current),
          Infinity
        )
      )
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
