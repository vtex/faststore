import { sendAnalyticsEvent } from '@faststore/sdk'
import {
  Alert as UIAlert,
  Badge as UIBadge,
  Button as UIButton,
  List as UIList,
  SlideOver as UISlideOver,
  SlideOverHeader as UISlideOverHeader,
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
import styles from './cart-sidebar.module.scss'

function CartSidebar() {
  const { currency } = useSession()
  const btnProps = useCheckoutButton()
  const cart = useCart()
  const { cart: displayCart, closeCart } = useUI()
  const { fade, fadeOut } = useFadeEffect()

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

  const closeBtnProps = {
    testId: 'cart-sidebar-button-close',
  }

  return (
    <UISlideOver
      fade={fade}
      isOpen={displayCart}
      onDismiss={() => fadeOut()}
      size="partial"
      direction="rightSide"
      className={styles.fsCartSidebar}
      onTransitionEnd={() => fade === 'out' && closeCart()}
      data-testid="cart-sidebar"
    >
      <UISlideOverHeader closeBtnProps={closeBtnProps} onClose={fadeOut}>
        <div data-fs-cart-sidebar-title>
          <p data-fs-cart-sidebar-title-text className="text__lead">
            Your Cart
          </p>
          <UIBadge variant="info">{totalItems}</UIBadge>
        </div>
      </UISlideOverHeader>
      <UIAlert icon={<Icon name="Truck" />}>
        Free shipping starts at $300
      </UIAlert>

      {isEmpty ? (
        <EmptyCart onDismiss={fadeOut} />
      ) : (
        <>
          <UIList data-fs-cart-sidebar-list>
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
          </UIList>

          <footer data-fs-cart-sidebar-footer>
            <OrderSummary
              subTotal={subTotal}
              total={total}
              numberOfItems={totalItems}
              checkoutButton={
                <UIButton
                  data-fs-cart-sidebar-checkout-button
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
          </footer>
        </>
      )}
    </UISlideOver>
  )
}

export default CartSidebar
