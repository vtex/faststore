import { sendAnalyticsEvent } from '@faststore/sdk'
import {
  CartItem as UICartItem,
  CartItemActions as UICartItemActions,
  CartItemSummary as UICartItemSummary,
  CartItemTitle as UICartItemTitle,
  CartItemPrices as UICartItemPrices,
  CartItemContent as UICartItemContent,
  CartItemImage as UICartItemImage,
} from '@faststore/ui'
import { useCallback, useMemo } from 'react'
import type {
  AddToCartEvent,
  CurrencyCode,
  RemoveFromCartEvent,
} from '@faststore/sdk'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import { Image } from 'src/components/ui/Image'
import Price from 'src/components/ui/Price'
import QuantitySelector from 'src/components/ui/QuantitySelector'
import { cartStore } from 'src/sdk/cart'
import { useRemoveButton } from 'src/sdk/cart/useRemoveButton'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import { useSession } from 'src/sdk/session'
import type { CartItem as ICartItem } from 'src/sdk/cart'
import type { AnalyticsItem } from 'src/sdk/analytics/types'

import styles from './cart-item.module.scss'

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
  gift?: boolean
}

function CartItem({ item, gift = false }: Props) {
  const btnProps = useRemoveButton(item)

  const { sendCartItemEvent } = useCartItemEvent()

  const onQuantityChange = useCallback(
    (quantity: number) => {
      sendCartItemEvent(item, quantity)

      cartStore.updateItemQuantity(item.id, quantity)
    },
    [item, sendCartItemEvent]
  )

  return (
    <UICartItem
      className={styles.fsCartItem}
      data-testid="cart-item"
      data-sku={item.itemOffered.sku}
      data-seller={item.seller.identifier}
    >
      <UICartItemContent>
        <UICartItemImage>
          <Image
            src={item.itemOffered.image[0].url}
            alt={item.itemOffered.image[0].alternateName}
            width={72}
            height={72}
          />
        </UICartItemImage>
        <UICartItemSummary>
          <UICartItemTitle className="text__body">
            {item.itemOffered.isVariantOf.name}
          </UICartItemTitle>
          {!gift && (
            <UICartItemPrices>
              <Price
                value={item.listPrice}
                formatter={useFormattedPrice}
                testId="list-price"
                data-value={item.listPrice}
                variant="listing"
                classes="text__legend"
                SRText="Original price:"
              />
              <Price
                value={item.price}
                formatter={useFormattedPrice}
                testId="price"
                data-value={item.price}
                variant="spot"
                classes="text__title-subsection"
                SRText="Price:"
              />
            </UICartItemPrices>
          )}
        </UICartItemSummary>
      </UICartItemContent>

      {!gift && (
        <UICartItemActions>
          <Button
            variant="tertiary"
            icon={<Icon name="XCircle" width={18} height={18} />}
            iconPosition="left"
            {...btnProps}
          >
            Remove
          </Button>
          <QuantitySelector
            min={1}
            initial={item.quantity}
            onChange={onQuantityChange}
          />
        </UICartItemActions>
      )}
    </UICartItem>
  )
}

export default CartItem
