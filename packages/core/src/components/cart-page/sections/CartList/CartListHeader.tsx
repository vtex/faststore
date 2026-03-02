import { Button, Icon } from '@faststore/ui'
import { useCallback } from 'react'

import { useCartPage } from '../../context/CartPageContext'

import styles from './CartList.module.scss'

interface CartListHeaderProps {
  totalItems: number
  unavailableCount: number
}

export default function CartListHeader({
  totalItems,
  unavailableCount,
}: CartListHeaderProps) {
  const { removeAllProducts, mutating } = useCartPage()

  const handleRemoveAll = useCallback(() => {
    removeAllProducts()
  }, [removeAllProducts])

  return (
    <div className={styles.cartListHeader}>
      <span className={styles.cartListHeaderCount}>
        {totalItems} {totalItems === 1 ? 'item' : 'items'}
        {unavailableCount > 0 && (
          <span className={styles.cartListHeaderUnavailable}>
            {' '}
            ({unavailableCount} unavailable)
          </span>
        )}
      </span>
      <Button
        variant="tertiary"
        size="small"
        onClick={handleRemoveAll}
        disabled={mutating}
        icon={<Icon name="Trash" />}
        iconPosition="left"
      >
        Remove All
      </Button>
    </div>
  )
}
