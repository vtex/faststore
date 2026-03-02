import { useEffect, useMemo } from 'react'
import type { CurrencyCode, ViewCartEvent } from '@faststore/sdk'

import { useCheckoutCart } from 'src/sdk/checkout/useCheckoutCart'
import type { BffProductPrice } from 'src/sdk/checkout/operations/cartOperations'
import CartPageCartItem from './CartPageCartItem'
import ShippingPreview from './ShippingPreview'
import CouponSection from './CouponSection'
import CartPageSummary from './CartPageSummary'
import CartActionButton from './CartActionButton'
import CartUnavailableItems from './CartUnavailableItems'
import CartPageSkeleton from './CartPageSkeleton'
import EmptyCart from '../EmptyCart'

import styles from './cart-page.module.scss'

function getSellingPrice(price: BffProductPrice): number {
  if (price.__typename === 'PriceWithDiscount') {
    return price.valueWithDiscount.asNumber
  }
  return price.value.asNumber
}

function getListPrice(price: BffProductPrice): number {
  return price.value.asNumber
}

function CartPage() {
  const {
    items,
    unavailableItems,
    summary,
    delivery,
    storePreferences,
    promoCodes,
    cartValue,
    totalItems,
    locale,
    isEmpty,
    isLoading,
    changeQuantity,
    removeProduct,
    removeProducts,
    addPromoCode,
    removePromoCode,
    searchAddress,
    selectCompleteAddress,
    selectIncompleteAddress,
  } = useCheckoutCart()

  const currencyCode = storePreferences?.currency ?? 'USD'

  // Send view_cart analytics on mount
  useEffect(() => {
    if (items.length === 0) return

    import('@faststore/sdk').then(({ sendAnalyticsEvent }) => {
      sendAnalyticsEvent<ViewCartEvent>({
        name: 'view_cart',
        params: {
          currency: currencyCode as CurrencyCode,
          value: cartValue,
          items: items.map((item) => {
            const sellingPrice = getSellingPrice(item.price)
            const listPrice = getListPrice(item.price)
            return {
              item_id: item.productId,
              item_name: item.name,
              item_brand: item.brandName ?? '',
              item_variant: item.skuName,
              quantity: item.quantity,
              price: sellingPrice,
              discount: listPrice - sellingPrice,
              currency: currencyCode as CurrencyCode,
              item_variant_name: item.skuName,
              product_reference_id: item.productId,
            }
          }),
        },
      })
    })
    // Only fire on mount / when cart data first loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length > 0])

  const handleAddCoupon = async (code: string) => {
    await addPromoCode(code)
  }

  const handleRemoveCoupon = async (code: string) => {
    await removePromoCode(code)
  }

  const totalItemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  )

  if (isLoading) {
    return <CartPageSkeleton />
  }

  if (isEmpty && unavailableItems.length === 0) {
    return (
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '3rem 1rem',
        }}
      >
        <EmptyCart onDismiss={() => (window.location.href = '/')} />
      </div>
    )
  }

  return (
    <div className={styles.cartPage} data-fs-cart-page>
      {/* Content column */}
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>Your Cart</h1>
          <span className={styles.headerCount}>
            {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
          </span>
        </div>

        <ul className={styles.itemList}>
          {items.map((item) => (
            <li key={item.id}>
              <CartPageCartItem
                item={item}
                currencyCode={currencyCode}
                locale={locale}
                onQuantityChange={changeQuantity}
                onRemove={removeProduct}
              />
            </li>
          ))}
        </ul>

        <CartUnavailableItems
          items={unavailableItems}
          onRemoveAll={removeProducts}
        />
      </div>

      {/* Sidebar column */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarSticky}>
          <ShippingPreview
            delivery={delivery}
            currencyCode={currencyCode}
            locale={locale}
            onSearchAddress={searchAddress}
            onSelectCompleteAddress={selectCompleteAddress}
            onSelectIncompleteAddress={selectIncompleteAddress}
          />

          <CouponSection
            appliedCoupons={promoCodes}
            onAddCoupon={handleAddCoupon}
            onRemoveCoupon={handleRemoveCoupon}
          />

          <CartPageSummary
            summary={summary}
            currencyCode={currencyCode}
            locale={locale}
            checkoutButton={<CartActionButton disabled={isEmpty} />}
          />
        </div>
      </aside>

      {/* Mobile sticky checkout button */}
      <div className={styles.mobileAction}>
        <CartActionButton disabled={isEmpty} />
      </div>
    </div>
  )
}

export default CartPage
