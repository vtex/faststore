import type { Resolver } from '..'
import type { StoreAggregateOffer } from './aggregateOffer'
import {
  getFirstSeller,
  inStock,
  inStockOrderFormItem,
} from '../utils/productStock'
import { getItemPriceByKey } from '../utils/price'
import type { ArrayElementType } from '../../../typings'
import type { Item } from '../clients/search/types/ProductSearchResult'
import type { EnhancedSku } from '../utils/enhanceSku'
import type { OrderFormItem } from '../clients/commerce/types/OrderForm'

type OrderFormProduct = OrderFormItem & { product: Promise<EnhancedSku> }
type SearchProduct = ArrayElementType<
  ReturnType<typeof StoreAggregateOffer.offers>
>
type Root = SearchProduct | OrderFormProduct

const isSearchItem = (item: any): item is Item => 'sellers' in item
const isOrderFormItem = (item: any): item is OrderFormProduct =>
  'skuName' in item

const getAvailability = (available: boolean) =>
  available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'

export const StoreOffer: Record<string, Resolver<Root>> = {
  priceCurrency: () => '',
  priceValidUntil: (item) => {
    if (isSearchItem(item)) {
      return getFirstSeller(item.sellers)?.commertialOffer.PriceValidUntil ?? ''
    }

    if (isOrderFormItem(item)) {
      return item.priceValidUntil ?? ''
    }

    return null
  },
  itemCondition: () => 'https://schema.org/NewCondition',
  availability: async (item) => {
    if (isSearchItem(item)) {
      return getAvailability(!!inStock(item))
    }

    if (isOrderFormItem(item)) {
      return getAvailability(inStockOrderFormItem(item.availability))
    }

    return null
  },
  seller: (item) => {
    if (isSearchItem(item)) {
      return {
        // TODO: Check if identifier is the ID(1) or the name of seller (VTEX)
        identifier: getFirstSeller(item.sellers)?.sellerName ?? '',
      }
    }

    if (isOrderFormItem(item)) {
      return {
        identifier: item.seller,
      }
    }

    return null
  },
  price: (item) => {
    if (isSearchItem(item)) {
      return getItemPriceByKey(item, 'spotPrice') // TODO add spot price calculation
    }

    if (isOrderFormItem(item)) {
      return item.price / 1e2
    }

    return null
  },
  sellingPrice: (item) => {
    if (isSearchItem(item)) {
      // TODO: Check if Price is SellingPrice
      return getItemPriceByKey(item, 'Price')
    }

    if (isOrderFormItem(item)) {
      return item.sellingPrice / 1e2
    }

    return null
  },
  listPrice: (item) => {
    if (isSearchItem(item)) {
      return getItemPriceByKey(item, 'ListPrice')
    }

    if (isOrderFormItem(item)) {
      return item.listPrice / 1e2
    }

    return null
  },
  itemOffered: ({ product }) => product,
  quantity: (item) => {
    if (isSearchItem(item)) {
      return item.sellers.reduce(
        (quantity, seller) =>
          quantity + seller.commertialOffer.AvailableQuantity,
        0
      )
    }

    if (isOrderFormItem(item)) {
      return item.quantity
    }

    return null
  },
}
