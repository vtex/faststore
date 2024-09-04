import {
  availability,
  inStock,
  inStockOrderFormItem,
  price,
  sellingPrice,
} from '../utils/productStock'
import type { Resolver } from '..'
import type { StoreAggregateOffer } from './aggregateOffer'
import type { ArrayElementType } from '../../../typings'
import type { EnhancedSku } from '../utils/enhanceSku'
import type { OrderFormItem } from '../clients/commerce/types/OrderForm'

type OrderFormProduct = OrderFormItem & { product: EnhancedSku }
type SearchProduct = ArrayElementType<
  ReturnType<typeof StoreAggregateOffer.offers>
>
type Root = SearchProduct | OrderFormProduct

const isSearchItem = (item: Root): item is SearchProduct =>
  'Price' in item && 'seller' in item && 'product' in item

const isOrderFormItem = (item: Root): item is OrderFormProduct =>
  'skuName' in item

export const StoreOffer: Record<string, Resolver<Root>> = {
  priceCurrency: async (_, __, ctx) => {
    const { 
      loaders: { salesChannelLoader }, 
      storage: { channel } 
    } = ctx

    const sc = await salesChannelLoader.load(channel.salesChannel);
    
    return sc.CurrencyCode ?? '';
  },
  priceValidUntil: (root) => {
    if (isSearchItem(root)) {
      return root.PriceValidUntil ?? ''
    }

    if (isOrderFormItem(root)) {
      return root.priceValidUntil ?? ''
    }

    return null
  },
  itemCondition: () => 'https://schema.org/NewCondition',
  availability: async (root) => {
    if (isSearchItem(root)) {
      return availability(inStock(root))
    }

    if (isOrderFormItem(root)) {
      return availability(inStockOrderFormItem(root.availability))
    }

    return null
  },
  seller: (root, _, ctx) => {
    if (isSearchItem(root)) {
      return {
        identifier: ctx.storage.channel?.seller || root.seller.sellerId || '',
      }
    }

    if (isOrderFormItem(root)) {
      return {
        identifier: root.seller,
      }
    }

    return null
  },
  price: (root) => {
    if (isSearchItem(root)) {
      return price(root)
    }

    if (isOrderFormItem(root)) {
      return root.sellingPrice / 1e2
    }

    return null
  },
  sellingPrice: (root) => {
    if (isSearchItem(root)) {
      return sellingPrice(root)
    }

    if (isOrderFormItem(root)) {
      return root.sellingPrice / 1e2
    }

    return null
  },
  listPrice: (root) => {
    if (isSearchItem(root)) {
      return root.ListPrice ?? 0
    }

    if (isOrderFormItem(root)) {
      return root.listPrice / 1e2
    }

    return null
  },
  itemOffered: (root) => {
    if (isSearchItem(root)) {
      return root.product
    }

    if (isOrderFormItem(root)) {
      return {
        ...root.product,
        attachmentsValues: root.attachments,
      }
    }

    return null
  },
  quantity: (root) => {
    if (isSearchItem(root)) {
      return root.AvailableQuantity ?? 0
    }

    if (isOrderFormItem(root)) {
      return root.quantity
    }

    return null
  },
}
