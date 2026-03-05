import type {
  AddToCartEvent,
  CurrencyCode,
  RemoveFromCartEvent,
} from '@faststore/sdk'

import type { AnalyticsItem } from 'src/sdk/analytics/types'

interface FCAnalyticsItemInput {
  productId: string
  itemId: string
  name: string
  sellingPrice: number
  listPrice: number
  sellerId: string
}

function mapToAnalyticsItem(item: FCAnalyticsItemInput): AnalyticsItem {
  return {
    item_id: item.productId,
    item_name: item.name,
    item_variant: item.itemId,
    price: item.sellingPrice,
    discount: item.listPrice - item.sellingPrice,
    quantity: 1,
    currency: '' as CurrencyCode,
    item_brand: '',
    item_variant_name: item.name,
    product_reference_id: '',
  }
}

export function sendCartAnalyticsEvent(
  item: FCAnalyticsItemInput,
  quantityDelta: number,
  currencyCode: string
) {
  import('@faststore/sdk').then(({ sendAnalyticsEvent }) => {
    const analyticsItem = mapToAnalyticsItem(item)

    analyticsItem.currency = currencyCode as CurrencyCode
    analyticsItem.quantity = Math.abs(quantityDelta)

    const eventName: 'add_to_cart' | 'remove_from_cart' =
      quantityDelta > 0 ? 'add_to_cart' : 'remove_from_cart'

    sendAnalyticsEvent<
      AddToCartEvent<AnalyticsItem> | RemoveFromCartEvent<AnalyticsItem>
    >({
      name: eventName,
      params: {
        currency: currencyCode as CurrencyCode,
        value: item.sellingPrice * Math.abs(quantityDelta),
        items: [analyticsItem],
      },
    })
  })
}
