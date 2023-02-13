import { sendAnalyticsEvent } from '@faststore/sdk'
import { useCallback } from 'react'
import type { CurrencyCode, RemoveFromCartEvent } from '@faststore/sdk'

import type { AnalyticsItem } from 'src/sdk/analytics/types'

import { useSession } from '../session'
import { cartStore } from './index'
import type { CartItem } from '.'

export const useRemoveButton = (item: CartItem | null) => {
  const {
    currency: { code },
  } = useSession()

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (!item) {
        return
      }

      sendAnalyticsEvent<RemoveFromCartEvent<AnalyticsItem>>({
        name: 'remove_from_cart',
        params: {
          currency: code as CurrencyCode,
          value: item.price * item.quantity, // TODO: In the future, we can explore more robust ways of calculating the value (gift items, discounts, etc.).
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

      cartStore.removeItem(item.id)
    },
    [code, item]
  )

  return {
    onClick,
    'data-testid': 'remove-from-cart-button',
    'data-sku': item?.itemOffered.sku,
  }
}
