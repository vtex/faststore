import { useCallback } from 'react'
import { sendAnalyticsEvent, useSession } from '@faststore/sdk'
import type { CurrencyCode, AddToCartEvent } from '@faststore/sdk'

import type { AnalyticsItem } from 'src/sdk/analytics/types'
import type { CartItem } from 'src/sdk/cart/validate'

import { useUI } from '../ui'
import { useCart } from './useCart'

export const useBuyButton = (item: CartItem | null) => {
  const { addItem } = useCart()
  const { openMinicart } = useUI()
  const {
    currency: { code },
  } = useSession()

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (!item) {
        return
      }

      sendAnalyticsEvent<AddToCartEvent<AnalyticsItem>>({
        name: 'add_to_cart',
        params: {
          currency: code as CurrencyCode,
          // TODO: In the future, we can explore more robust ways of
          // calculating the value (gift items, discounts, etc.).
          value: item.price * item.quantity,
          items: [
            {
              item_id: item.itemOffered.isVariantOf.productGroupID,
              item_name: item.itemOffered.isVariantOf.name,
              item_brand: item.itemOffered.brand.name,
              item_variant: item.itemOffered.sku,
              quantity: item.quantity,
              price: item.price,
              discount: item.listPrice - item.price,
              currency: code as CurrencyCode,
              item_variant_name: item.itemOffered.name,
              product_reference_id: item.itemOffered.gtin,
            },
          ],
        },
      })

      addItem(item)
      openMinicart()
    },
    [addItem, code, item, openMinicart]
  )

  return {
    onClick,
    'data-testid': 'buy-button',
    'data-sku': item?.itemOffered.sku,
    'data-seller': item?.seller.identifier,
  }
}
