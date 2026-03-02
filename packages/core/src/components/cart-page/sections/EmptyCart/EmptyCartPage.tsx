import { Button, Icon } from '@faststore/ui'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

import styles from './EmptyCartPage.module.scss'

export default function EmptyCartPage() {
  const router = useRouter()

  const handleStartShopping = useCallback(() => {
    router.push('/')
  }, [router])

  return (
    <div className={styles.emptyCart} data-fs-empty-cart-page>
      <div className={styles.emptyCartContent}>
        <Icon
          name="ShoppingCart"
          width={64}
          height={64}
          className={styles.emptyCartIcon}
        />
        <h1 className={styles.emptyCartTitle}>Your Cart is Empty</h1>
        <p className={styles.emptyCartDescription}>
          Looks like you haven&apos;t added anything to your cart yet. Explore
          our store and find something you love.
        </p>
        <Button
          variant="primary"
          onClick={handleStartShopping}
          icon={<Icon name="ArrowRight" width={18} height={18} />}
          iconPosition="right"
        >
          Start Shopping
        </Button>
      </div>
    </div>
  )
}
