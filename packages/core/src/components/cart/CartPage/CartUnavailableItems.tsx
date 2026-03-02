import { useCallback } from 'react'
import type { BffUnavailableProduct } from 'src/sdk/checkout/operations/cartOperations'

import styles from './cart-page.module.scss'

interface CartUnavailableItemsProps {
  items: BffUnavailableProduct[]
  onRemoveAll: (itemIndexes: number[]) => void
}

function CartUnavailableItems({
  items,
  onRemoveAll,
}: CartUnavailableItemsProps) {
  const handleRemoveAll = useCallback(() => {
    onRemoveAll(items.map((item) => item.originalIndex))
  }, [items, onRemoveAll])

  if (items.length === 0) return null

  return (
    <div className={styles.unavailableSection} data-fs-unavailable-items>
      <div className={styles.unavailableHeader}>
        <h3 className={styles.unavailableTitle}>
          Unavailable Items ({items.length})
        </h3>
        <button
          onClick={handleRemoveAll}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.8125rem',
            color: 'var(--fs-color-danger-text, #c0392b)',
            textDecoration: 'underline',
          }}
        >
          Remove all
        </button>
      </div>

      <ul className={styles.unavailableList}>
        {items.map((item) => (
          <li key={item.id} className={styles.unavailableItem}>
            <img
              src={item.imageUrl}
              alt={item.name}
              className={styles.unavailableItemImage}
            />
            <div>
              <p style={{ margin: 0, fontWeight: 500 }}>{item.name}</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#757575' }}>
                {item.skuName}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CartUnavailableItems
