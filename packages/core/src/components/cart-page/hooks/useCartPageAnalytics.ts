import type {
  CurrencyCode,
  ViewCartEvent,
  AddToCartEvent,
  RemoveFromCartEvent,
} from '@faststore/sdk'
import { useCallback } from 'react'

import { useSession } from 'src/sdk/session'
import type { AnalyticsItem } from 'src/sdk/analytics/types'
import type { Product, PriceWithDiscount } from '../context/types'

function getPrice(product: Product): number {
  if (product.price.__typename === 'PriceWithDiscount') {
    return (product.price as PriceWithDiscount).valueWithDiscount.asNumber
  }

  return product.price.value.asNumber
}

function getListPrice(product: Product): number {
  return product.price.value.asNumber
}

function mapProductToAnalyticsItem(product: Product): AnalyticsItem {
  const price = getPrice(product)
  const listPrice = getListPrice(product)

  return {
    item_id: product.productId,
    item_name: product.name,
    item_brand: product.brandName ?? '',
    item_variant: product.itemId,
    quantity: product.quantity,
    price,
    discount: listPrice - price,
    currency: '' as CurrencyCode,
    item_variant_name: product.skuName,
    product_reference_id: product.productId,
  }
}

export function useCartPageAnalytics() {
  const {
    currency: { code },
  } = useSession()

  const sendViewCartEvent = useCallback(
    (items: Product[], total: number) => {
      import('@faststore/sdk').then(({ sendAnalyticsEvent }) => {
        sendAnalyticsEvent<ViewCartEvent>({
          name: 'view_cart',
          params: {
            currency: code as CurrencyCode,
            value: total,
            items: items.map((item) => ({
              ...mapProductToAnalyticsItem(item),
              currency: code as CurrencyCode,
            })),
          },
        })
      })
    },
    [code]
  )

  const sendAddToCartEvent = useCallback(
    (item: Product, quantityDelta: number) => {
      import('@faststore/sdk').then(({ sendAnalyticsEvent }) => {
        const price = getPrice(item)

        sendAnalyticsEvent<AddToCartEvent<AnalyticsItem>>({
          name: 'add_to_cart',
          params: {
            currency: code as CurrencyCode,
            value: price * quantityDelta,
            items: [
              {
                ...mapProductToAnalyticsItem(item),
                quantity: quantityDelta,
                currency: code as CurrencyCode,
              },
            ],
          },
        })
      })
    },
    [code]
  )

  const sendRemoveFromCartEvent = useCallback(
    (item: Product, quantityDelta: number) => {
      import('@faststore/sdk').then(({ sendAnalyticsEvent }) => {
        const price = getPrice(item)

        sendAnalyticsEvent<RemoveFromCartEvent<AnalyticsItem>>({
          name: 'remove_from_cart',
          params: {
            currency: code as CurrencyCode,
            value: price * quantityDelta,
            items: [
              {
                ...mapProductToAnalyticsItem(item),
                quantity: quantityDelta,
                currency: code as CurrencyCode,
              },
            ],
          },
        })
      })
    },
    [code]
  )

  const sendBeginCheckoutEvent = useCallback(
    (items: Product[], total: number) => {
      import('@faststore/sdk').then(({ sendAnalyticsEvent }) => {
        sendAnalyticsEvent({
          name: 'begin_checkout',
          params: {
            currency: code as CurrencyCode,
            value: total,
            items: items.map((item) => ({
              ...mapProductToAnalyticsItem(item),
              currency: code as CurrencyCode,
            })),
          },
        })
      })
    },
    [code]
  )

  return {
    sendViewCartEvent,
    sendAddToCartEvent,
    sendRemoveFromCartEvent,
    sendBeginCheckoutEvent,
  }
}
