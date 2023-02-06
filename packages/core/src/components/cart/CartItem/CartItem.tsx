import { sendAnalyticsEvent } from '@faststore/sdk'
import {
  CartItem as UICartItem,
  CartItemImage as UICartItemImage,
  CartItemSummary as UICartItemSummary,
} from '@faststore/ui'
import { useCallback, useMemo } from 'react'
import type {
  AddToCartEvent,
  CurrencyCode,
  RemoveFromCartEvent,
} from '@faststore/sdk'

import { Image } from 'src/components/ui/Image'
import { cartStore } from 'src/sdk/cart'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import { useSession } from 'src/sdk/session'
import { useRemoveButton } from 'src/sdk/cart/useRemoveButton'
import type { CartItem as ICartItem } from 'src/sdk/cart'
import type { AnalyticsItem } from 'src/sdk/analytics/types'

function useCartItemEvent() {
  const {
    currency: { code },
  } = useSession()

  const sendCartItemEvent = useCallback(
    (item: Props['item'], quantity: number) => {
      const quantityDelta = quantity - item.quantity

      return sendAnalyticsEvent<
        AddToCartEvent<AnalyticsItem> | RemoveFromCartEvent<AnalyticsItem>
      >({
        name: quantityDelta > 0 ? 'add_to_cart' : 'remove_from_cart',
        params: {
          currency: code as CurrencyCode,
          // TODO: In the future, we can explore more robust ways of
          // calculating the value (gift items, discounts, etc.).
          value: item.price * Math.abs(quantityDelta),
          items: [
            {
              item_id: item.itemOffered.isVariantOf.productGroupID,
              item_name: item.itemOffered.isVariantOf.name,
              item_brand: item.itemOffered.brand.name,
              item_variant: item.itemOffered.sku,
              quantity: Math.abs(quantityDelta),
              price: item.price,
              discount: item.listPrice - item.price,
              currency: code as CurrencyCode,
              item_variant_name: item.itemOffered.name,
              product_reference_id: item.itemOffered.gtin,
            },
          ],
        },
      })
    },
    [code]
  )

  return useMemo(() => ({ sendCartItemEvent }), [sendCartItemEvent])
}

interface Props {
  item: ICartItem
}

function CartItem({ item }: Props) {
  const btnProps = useRemoveButton(item)

  const { sendCartItemEvent } = useCartItemEvent()

  const onQuantityChange = useCallback(
    (quantity: number) => {
      sendCartItemEvent(item, quantity)

      cartStore.updateItemQuantity(item.id, quantity)
    },
    [item, sendCartItemEvent]
  )

  const skuActiveVariants =
    item.itemOffered.isVariantOf.skuVariants.activeVariations
  const activeVariations = Object.keys(skuActiveVariants).map((key) => ({
    label: key,
    option: skuActiveVariants[key],
  }))

  return (
    <UICartItem
      price={{
        value: item.price,
        listPrice: item.listPrice,
        formatter: useFormattedPrice,
      }}
      quantity={item.quantity}
      onQuantityChange={onQuantityChange}
      removeBtnProps={btnProps}
      data-sku={item.itemOffered.sku}
      data-seller={item.seller.identifier}
    >
      <UICartItemImage>
        <Image
          src={item.itemOffered.image[0].url}
          alt={item.itemOffered.image[0].alternateName}
          width={56}
          height={56}
        />
      </UICartItemImage>
      <UICartItemSummary
        title={item.itemOffered.isVariantOf.name}
        activeVariations={activeVariations}
      />
    </UICartItem>
  )
}

export default CartItem
