import {
  Button as UIButton,
  Icon as UIIcon,
  EmptyState as UIEmptyState,
} from '@faststore/ui'

import { useCartFC } from 'src/sdk/fastcheckout/useCartFC'
import { useCartMutations } from 'src/sdk/fastcheckout/useCartMutations'
import { useUndoRemove } from 'src/sdk/fastcheckout/useUndoRemove'
import type { FCCart, ItemMutationState } from 'src/sdk/fastcheckout/types'
import { adaptCartItem } from 'src/sdk/fastcheckout/types'
import { useSession } from 'src/sdk/session'

import CartItemFC from '../CartItemFC/CartItemFC'
import CartUndoToast from '../CartUndoToast/CartUndoToast'
import UnavailableItems from '../UnavailableItems/UnavailableItems'

import styles from './CartPage.module.scss'

function CartPageSkeleton() {
  return (
    <div className={styles.cartPage__skeleton}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className={styles.cartPage__skeletonItem}>
          <div className={styles.cartPage__skeletonImage} />
          <div className={styles.cartPage__skeletonContent}>
            <div
              className={`${styles.cartPage__skeletonLine} ${styles['cartPage__skeletonLine--long']}`}
            />
            <div
              className={`${styles.cartPage__skeletonLine} ${styles['cartPage__skeletonLine--medium']}`}
            />
            <div
              className={`${styles.cartPage__skeletonLine} ${styles['cartPage__skeletonLine--short']}`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function CartPageEmpty() {
  return (
    <div className={styles.cartPage__empty}>
      <UIEmptyState
        title="Your cart is empty"
        titleIcon={
          <UIIcon name="ShoppingCart" width={56} height={56} weight="thin" />
        }
      >
        <UIButton
          variant="secondary"
          onClick={() => {
            window.location.href = '/'
          }}
        >
          Start Shopping
        </UIButton>
      </UIEmptyState>
    </div>
  )
}

interface CartPageErrorProps {
  onRetry: () => void
}

function CartPageError({ onRetry }: CartPageErrorProps) {
  return (
    <div className={styles.cartPage__error}>
      <div className={styles.cartPage__errorIcon}>
        <UIIcon name="Warning" width={56} height={56} weight="thin" />
      </div>
      <h2 className={styles.cartPage__errorTitle}>
        Unable to load your cart
      </h2>
      <p className={styles.cartPage__errorText}>
        Something went wrong while loading your cart. Please try again.
      </p>
      <UIButton variant="secondary" onClick={onRetry}>
        Try Again
      </UIButton>
    </div>
  )
}

function CartPage() {
  const { data, isLoading, error, mutate, setOptimisticData } = useCartFC()
  const {
    currency: { code: currencyCode },
  } = useSession()
  const {
    changeQuantity,
    removeItem,
    removeProducts,
    itemStates,
  } = useCartMutations(data, setOptimisticData, mutate, currencyCode)

  const {
    removedItem,
    isUndoVisible,
    triggerRemove,
    undo,
    dismiss,
  } = useUndoRemove(removeItem, mutate)

  if (isLoading && !data) {
    return (
      <div className={styles.cartPage}>
        <div className={styles.cartPage__header}>
          <h1 className={styles.cartPage__title}>Cart</h1>
        </div>
        <CartPageSkeleton />
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className={styles.cartPage}>
        <div className={styles.cartPage__header}>
          <h1 className={styles.cartPage__title}>Cart</h1>
        </div>
        <CartPageError onRetry={mutate} />
      </div>
    )
  }

  if (!data || data.__typename === 'EmptyCart') {
    return (
      <div className={styles.cartPage}>
        <div className={styles.cartPage__header}>
          <h1 className={styles.cartPage__title}>Cart</h1>
        </div>
        <CartPageEmpty />
      </div>
    )
  }

  const cart = data as FCCart
  const availableItems = cart.availableItems.map(adaptCartItem)
  const formattedTotal = cart.total

  return (
    <div className={styles.cartPage}>
      <div className={styles.cartPage__header}>
        <h1 className={styles.cartPage__title}>Cart</h1>
        <span className={styles.cartPage__itemCount}>
          ({cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'})
        </span>
      </div>

      <div className={styles.cartPage__content}>
        {availableItems.length > 0 && (
          <ul className={styles.cartPage__list}>
            {availableItems.map((item) => (
              <li key={item.id} className={styles.cartPage__listItem}>
                <CartItemFC
                  item={item}
                  mutationState={
                    (itemStates.get(item.itemIndex) ?? 'idle') as ItemMutationState
                  }
                  onQuantityChange={(qty) =>
                    changeQuantity(item.itemIndex, qty)
                  }
                  onRemove={() =>
                    triggerRemove(item.itemIndex, {
                      quantity: item.quantity,
                      id: item.itemId,
                      seller: item.sellerId,
                      name: item.name,
                    })
                  }
                />
              </li>
            ))}
          </ul>
        )}

        {cart.unavailableItems.length > 0 && (
          <UnavailableItems
            items={cart.unavailableItems}
            itemStates={itemStates}
            onRemoveItem={(itemIndex) =>
              triggerRemove(itemIndex, null)
            }
            onRemoveAll={() =>
              removeProducts(
                cart.unavailableItems.map((i) => i.originalIndex)
              )
            }
          />
        )}

        {availableItems.length > 0 && (
          <div className={styles.cartPage__total}>
            <span>Total</span>
            <span>{formattedTotal}</span>
          </div>
        )}
      </div>

      {isUndoVisible && removedItem && (
        <CartUndoToast
          itemName={removedItem.name}
          onUndo={undo}
          onDismiss={dismiss}
        />
      )}
    </div>
  )
}

export default CartPage
