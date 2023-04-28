import { sendAnalyticsEvent } from '@faststore/sdk'
import {
  Button as UIButton,
  CartSidebar as UICartSidebar,
  CartSidebarFooter as UICartSidebarFooter,
  CartSidebarList as UICartSidebarList,
} from '@faststore/ui'

import type { CurrencyCode, ViewCartEvent } from '@faststore/sdk'
import { useEffect } from 'react'

import { Icon, useFadeEffect, useUI } from '@faststore/ui'
import { useCart } from 'src/sdk/cart'
import { useCheckoutButton } from 'src/sdk/cart/useCheckoutButton'
import { useSession } from 'src/sdk/session'

import Gift from '../../ui/Gift'
import CartItem from '../CartItem'
import EmptyCart from '../EmptyCart'
import OrderSummary from '../OrderSummary'
import styles from './section.module.scss'

function CartSidebar() {
  const { currency } = useSession()
  const btnProps = useCheckoutButton()
  const cart = useCart()
  const { closeCart } = useUI()
  const { fadeOut } = useFadeEffect()

  const { items, gifts, totalItems, isValidating, subTotal, total } = cart

  const isEmpty = items.length === 0

  useEffect(() => {
    sendAnalyticsEvent<ViewCartEvent>({
      name: 'view_cart',
      params: {
        currency: currency.code as CurrencyCode,
        value: total,
        items: items.concat(gifts).map((item) => ({
          item_id: item.itemOffered.isVariantOf.productGroupID,
          item_name: item.itemOffered.isVariantOf.name,
          item_brand: item.itemOffered.brand.name,
          item_variant: item.itemOffered.sku,
          quantity: item.quantity,
          price: item.price,
          discount: item.listPrice - item.price,
          currency: currency.code as CurrencyCode,
          item_variant_name: item.itemOffered.name,
          product_reference_id: item.itemOffered.gtin,
        })),
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <UICartSidebar
      overlayProps={{
        className: `section ${styles.section} section-cart-sidebar`,
      }}
      totalItems={totalItems}
      alertIcon={<Icon name="Truck" />}
      alertText="Free shipping starts at $300"
      onClose={fadeOut}
    >
      {isEmpty ? (
        <EmptyCart onDismiss={closeCart} />
      ) : (
        <>
          <UICartSidebarList>
            {items.map((item) => (
              <li key={item.id}>
                <CartItem item={item} />
              </li>
            ))}
            {gifts.length > 0 && (
              <>
                {gifts.map((item) => (
                  <li key={item.id}>
                    <Gift item={item} />
                  </li>
                ))}
              </>
            )}
          </UICartSidebarList>

          <UICartSidebarFooter>
            <OrderSummary
              subTotal={subTotal}
              total={total}
              numberOfItems={totalItems}
              checkoutButton={
                <UIButton
                  variant="primary"
                  icon={
                    !isValidating && (
                      <Icon name="ArrowRight" width={18} height={18} />
                    )
                  }
                  iconPosition="right"
                  {...btnProps}
                >
                  {isValidating ? 'Loading...' : 'Checkout'}
                </UIButton>
              }
            />
          </UICartSidebarFooter>
        </>
      )}
    </UICartSidebar>
  )
}

export default CartSidebar
