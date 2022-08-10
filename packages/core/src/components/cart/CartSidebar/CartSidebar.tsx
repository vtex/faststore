import { List } from '@faststore/ui'

import Alert from 'src/components/ui/Alert'
import { Badge } from 'src/components/ui/Badge'
import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'
import SlideOver from 'src/components/ui/SlideOver'
import { useCart } from 'src/sdk/cart'
import { useCheckoutButton } from 'src/sdk/cart/useCheckoutButton'
import { useUI } from 'src/sdk/ui/Provider'
import { useFadeEffect } from 'src/sdk/ui/useFadeEffect'

import CartItem from '../CartItem'
import EmptyCart from '../EmptyCart'
import OrderSummary from '../OrderSummary'
import styles from './cart-sidebar.module.scss'

function CartSidebar() {
  const btnProps = useCheckoutButton()
  const cart = useCart()
  const { cart: displayCart, closeCart } = useUI()
  const { fade, fadeOut } = useFadeEffect()

  const { items, gifts, totalItems, isValidating, subTotal, total } = cart

  const isEmpty = items.length === 0

  return (
    <SlideOver
      fade={fade}
      isOpen={displayCart}
      onDismiss={fadeOut}
      size="partial"
      direction="rightSide"
      className={styles.fsCartSidebar}
      onTransitionEnd={() => fade === 'out' && closeCart()}
    >
      <header data-fs-cart-sidebar-header data-testid="cart-sidebar">
        <div data-fs-cart-sidebar-title>
          <p data-fs-cart-sidebar-title-text className="text__lead">
            Your Cart
          </p>
          <Badge variant="info">{totalItems}</Badge>
        </div>
        <Button
          variant="tertiary"
          data-fs-button-icon
          data-fs-cart-sidebar-close-button
          data-testid="cart-sidebar-button-close"
          aria-label="Close Cart"
          icon={<Icon name="X" width={32} height={32} />}
          onClick={fadeOut}
        />
      </header>
      <Alert icon={<Icon name="Truck" width={24} height={24} />}>
        Free shipping starts at $300
      </Alert>

      {isEmpty ? (
        <EmptyCart onDismiss={fadeOut} />
      ) : (
        <>
          <List data-fs-cart-sidebar-list>
            {items.map((item) => (
              <li key={item.id}>
                <CartItem item={item} />
              </li>
            ))}
          </List>

          {gifts.length > 0 && (
            <>
              <Alert icon={<Icon name="Gift" width={24} height={24} />}>
                Gifts
              </Alert>
              <List data-fs-cart-sidebar-list>
                {gifts.map((item) => (
                  <li key={item.id}>
                    <CartItem gift item={item} />
                  </li>
                ))}
              </List>
            </>
          )}

          <footer data-fs-cart-sidebar-footer>
            <OrderSummary
              subTotal={subTotal}
              total={total}
              numberOfItems={totalItems}
              checkoutButton={
                <Button
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
                </Button>
              }
            />
          </footer>
        </>
      )}
    </SlideOver>
  )
}

export default CartSidebar
