import { Loader } from '@faststore/ui'
import { useEffect, useRef } from 'react'

import { CartPageProvider, useCartPage } from './context/CartPageContext'
import { useCartPageAnalytics } from './hooks/useCartPageAnalytics'
import CartList from './sections/CartList/CartList'
import CartListHeader from './sections/CartList/CartListHeader'
import CartPageSummary from './sections/Summary/CartPageSummary'
import Coupon from './sections/Coupon/Coupon'
import CartActionButton from './sections/ActionButton/CartActionButton'
import CartActionMobile from './sections/ActionButton/CartActionMobile'
import ShippingChannelSelector from './sections/Shipping/ShippingChannelSelector'
import SelectedDeliveryInformation from './sections/Shipping/SelectedDeliveryInformation'
import EmptyCartPage from './sections/EmptyCart/EmptyCartPage'
import OneClickCheckoutOptions from './sections/OneClickCheckout/OneClickCheckoutOptions'

import styles from './CartPage.module.scss'

function CartPageContent() {
  const {
    cart,
    summary,
    shipping,
    coupon,
    customer,
    oneClickCheckoutOptions,
    loading,
    mutating,
    error,
  } = useCartPage()
  const { sendViewCartEvent } = useCartPageAnalytics()
  const viewCartSent = useRef(false)

  useEffect(() => {
    if (
      !loading &&
      cart &&
      cart.__typename === 'Cart' &&
      summary &&
      !viewCartSent.current
    ) {
      sendViewCartEvent(cart.availableItems, summary.total.asNumber)
      viewCartSent.current = true
    }
  }, [loading, cart, summary, sendViewCartEvent])

  if (loading) {
    return (
      <div className={styles.cartPage} data-fs-cart-page-loading>
        <div className={styles.cartPageLoader}>
          <Loader />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.cartPage} data-fs-cart-page-error>
        <div className={styles.cartPageError}>
          <h2>Something went wrong</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!cart || cart.__typename === 'EmptyCart') {
    return <EmptyCartPage />
  }

  const showShippingChannelSelector =
    shipping?.deliveryChannels?.includes('PICKUP') &&
    shipping?.mode !== 'MULTIDELIVERY'

  const isOrganization = customer?.__typename === 'Organization'

  return (
    <div className={styles.cartPage} data-fs-cart-page>
      <div className={styles.cartPageContent}>
        <h1 className={styles.cartPageTitle}>Cart</h1>

        <CartListHeader
          totalItems={cart.totalItems}
          unavailableCount={cart.unavailableItems.length}
        />

        {showShippingChannelSelector && shipping && (
          <ShippingChannelSelector
            deliveryChannels={shipping.deliveryChannels}
            mode={shipping.mode}
          />
        )}

        <CartList
          items={cart.availableItems}
          unavailableItems={cart.unavailableItems}
          shipping={shipping}
        />
      </div>

      <aside className={styles.cartPageSidebar}>
        <div className={styles.cartPageSidebarSticky}>
          {shipping && (
            <SelectedDeliveryInformation shipping={shipping} />
          )}

          {coupon && <Coupon coupon={coupon} />}

          {isOrganization && (
            <div className={styles.cartPageComment}>
              {/* B2B comment section - rendered for Organization customers */}
            </div>
          )}

          {summary && <CartPageSummary summary={summary} />}

          <div className={styles.cartPageActions}>
            <div className={styles.cartPageActionsDesktop}>
              <CartActionButton disabled={mutating} />
              {oneClickCheckoutOptions && (
                <OneClickCheckoutOptions
                  options={oneClickCheckoutOptions}
                />
              )}
            </div>
          </div>
        </div>
      </aside>

      <div className={styles.cartPageMobileActions}>
        <CartActionMobile
          summary={summary}
          disabled={mutating}
          oneClickCheckoutOptions={oneClickCheckoutOptions}
        />
      </div>
    </div>
  )
}

export default function CartPage() {
  return (
    <CartPageProvider>
      <CartPageContent />
    </CartPageProvider>
  )
}
