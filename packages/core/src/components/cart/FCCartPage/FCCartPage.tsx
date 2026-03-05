import { OrderSummary } from '@faststore/ui'
import { useMemo } from 'react'

import { useSession } from 'src/sdk/session'
import { usePriceFormatter } from 'src/sdk/product/useFormattedPrice'
import { useCartQuery } from 'src/sdk/fc-cart/useCartQuery'
import { useCartMutations } from 'src/sdk/fc-cart/useCartMutations'
import { isNonEmptyCart } from 'src/sdk/fc-cart/types'

import FCCartList from '../FCCartList/FCCartList'
import FCEmptyCart from '../FCEmptyCart/FCEmptyCart'
import styles from './FCCartPage.module.scss'

function FCCartPage() {
  const { cart, summary, isLoading, error, setCart, setSummary } =
    useCartQuery()

  const mutations = useCartMutations({
    setCart,
    setSummary,
    currentCart: cart,
  })

  const { currency } = useSession()
  const formatter = usePriceFormatter()

  const summaryValues = useMemo(() => {
    if (!summary) return null

    return {
      total: formatter(summary.total.asNumber),
      subtotal: summary.totalizers.items ?? undefined,
      discount: summary.totalizers.discounts ?? undefined,
    }
  }, [summary, formatter])

  if (isLoading) {
    return (
      <div className={styles.section}>
        <section className={styles.fcCartPage}>
          <div className={styles.fcCartLoading}>
            <div className={styles.fcCartSpinner} />
            <p>Loading your cart...</p>
          </div>
        </section>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.section}>
        <section className={styles.fcCartPage}>
          <div className={styles.fcCartError}>
            <p>Something went wrong loading your cart.</p>
            <p>{error}</p>
          </div>
        </section>
      </div>
    )
  }

  if (!cart || !isNonEmptyCart(cart)) {
    return (
      <div className={styles.section}>
        <section className={styles.fcCartPage}>
          <FCEmptyCart />
        </section>
      </div>
    )
  }

  return (
    <div className={styles.section}>
      <section className={styles.fcCartPage}>
        <h1 className={styles.fcCartTitle}>
          My Cart ({cart.totalItems}{' '}
          {cart.totalItems === 1 ? 'item' : 'items'})
        </h1>

        {mutations.mutationError && (
          <div className={styles.fcCartAlert} role="alert">
            {mutations.mutationError}
          </div>
        )}

        <div className={styles.fcCartLayout}>
          <div className={styles.fcCartMain}>
            <FCCartList
              items={cart.availableItems}
              unavailableItems={cart.unavailableItems}
              onQuantityChange={mutations.changeQuantity}
              onRemove={mutations.removeItem}
              onRemoveUnavailable={mutations.removeUnavailableItems}
              isMutating={mutations.isMutating}
            />
          </div>

          <aside className={styles.fcCartSidebar}>
            <OrderSummary
              subtotalLabel="Subtotal"
              subtotalValue={summaryValues?.subtotal ?? cart.total}
              discountValue={summaryValues?.discount}
              totalLabel="Total"
              totalValue={summaryValues?.total ?? cart.total}
            />
          </aside>
        </div>
      </section>
    </div>
  )
}

export default FCCartPage
