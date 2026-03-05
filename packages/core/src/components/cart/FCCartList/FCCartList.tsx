import { Button, Icon } from '@faststore/ui'

import type { FCCartProduct, FCCartUnavailableProduct } from 'src/sdk/fc-cart/types'
import FCCartItem from '../FCCartItem/FCCartItem'
import styles from '../FCCartPage/FCCartPage.module.scss'

interface FCCartListProps {
  items: FCCartProduct[]
  unavailableItems: FCCartUnavailableProduct[]
  onQuantityChange: (itemIndex: number, quantity: number) => void
  onRemove: (itemIndex: number) => void
  onRemoveUnavailable: (indexes: number[]) => void
  isMutating: boolean
}

function FCCartList({
  items,
  unavailableItems,
  onQuantityChange,
  onRemove,
  onRemoveUnavailable,
  isMutating,
}: FCCartListProps) {
  const handleRemoveAllUnavailable = () => {
    const indexes = unavailableItems.map((item) => item.originalIndex)
    onRemoveUnavailable(indexes)
  }

  return (
    <div className={styles.fcCartList}>
      <ul className={styles.fcCartListItems}>
        {items.map((item) => (
          <li key={item.id}>
            <FCCartItem
              item={item}
              onQuantityChange={onQuantityChange}
              onRemove={onRemove}
              isMutating={isMutating}
            />
          </li>
        ))}
      </ul>

      {unavailableItems.length > 0 && (
        <div className={styles.fcCartUnavailable}>
          <div className={styles.fcCartUnavailableHeader}>
            <Icon name="CircleWavyWarning" width={20} height={20} />
            <span>
              {unavailableItems.length} unavailable{' '}
              {unavailableItems.length === 1 ? 'item' : 'items'}
            </span>
            <Button
              variant="tertiary"
              size="small"
              onClick={handleRemoveAllUnavailable}
              disabled={isMutating}
            >
              Remove all
            </Button>
          </div>
          <ul className={styles.fcCartUnavailableList}>
            {unavailableItems.map((item) => (
              <li key={item.id} className={styles.fcCartUnavailableItem}>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  width={48}
                  height={48}
                />
                <div>
                  <span>{item.name}</span>
                  <small>{item.skuName}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default FCCartList
