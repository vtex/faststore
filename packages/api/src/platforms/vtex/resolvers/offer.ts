import type { Resolver } from '..'
import type { StoreAggregateOffer } from './aggregateOffer'
import { getFirstSeller, inStock } from '../utils/productStock'
import { getItemPriceByKey } from '../utils/price'
import type { ArrayElementType } from '../../../typings'

// TODO: Add type from orderform
type Root = ArrayElementType<ReturnType<typeof StoreAggregateOffer.offers>> // when querying search/product
// | (OrderFormItem & { product: Promise<EnhancedSku> }) // when querying order

export const StoreOffer: Record<string, Resolver<Root>> = {
  priceCurrency: () => '',
  priceValidUntil: ({ sellers }) =>
    getFirstSeller(sellers)?.commertialOffer.PriceValidUntil ?? '',
  itemCondition: () => 'https://schema.org/NewCondition',
  availability: (item) =>
    inStock(item)
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
  seller: ({ sellers }) => ({
    identifier: getFirstSeller(sellers)?.sellerName ?? '',
  }),
  price: (item) => getItemPriceByKey(item, 'spotPrice') / 1e2, // TODO add spot price calculation
  // TODO: Check if Price is SellingPrice
  sellingPrice: (item) => getItemPriceByKey(item, 'Price') / 1e2,
  listPrice: (item) => getItemPriceByKey(item, 'ListPrice') / 1e2,
  itemOffered: ({ product }) => product,
  quantity: ({ sellers }) =>
    sellers.reduce(
      (quantity, seller) => quantity + seller.commertialOffer.AvailableQuantity,
      0
    ),
}
