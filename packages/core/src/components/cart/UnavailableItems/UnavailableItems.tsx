import {
  Badge as UIBadge,
  Button as UIButton,
  Icon as UIIcon,
} from '@faststore/ui'

import { Image } from 'src/components/ui/Image'
import type {
  FCUnavailableItem,
  ItemMutationState,
} from 'src/sdk/fastcheckout/types'
import { UNAVAILABILITY_BADGES } from 'src/sdk/fastcheckout/types'

import styles from './UnavailableItems.module.scss'

function TrashIcon({ width = 16, height = 16 }: { width?: number; height?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 256 256"
      fill="currentColor"
    >
      <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" />
    </svg>
  )
}

interface UnavailableItemsProps {
  items: FCUnavailableItem[]
  itemStates: Map<number, ItemMutationState>
  onRemoveItem: (itemIndex: number) => void
  onRemoveAll: () => void
}

function UnavailableItems({
  items,
  itemStates,
  onRemoveItem,
  onRemoveAll,
}: UnavailableItemsProps) {
  if (items.length === 0) return null

  return (
    <div className={styles.unavailableItems}>
      <div className={styles.unavailableItems__header}>
        <h2 className={styles.unavailableItems__title}>
          <UIIcon name="Warning" width={20} height={20} />
          Items to review ({items.length})
        </h2>
        <UIButton
          variant="tertiary"
          size="small"
          onClick={onRemoveAll}
        >
          Remove all unavailable
        </UIButton>
      </div>

      <ul className={styles.unavailableItems__list}>
        {items.map((item) => {
          const isRemoving =
            itemStates.get(item.originalIndex) === 'removing'

          return (
            <li
              key={item.id}
              className={styles.unavailableItems__item}
              style={isRemoving ? { opacity: 0.3 } : undefined}
            >
              <div className={styles.unavailableItems__image}>
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={56}
                    height={56}
                  />
                ) : (
                  <UIIcon name="ShoppingCart" width={24} height={24} />
                )}
              </div>

              <div className={styles.unavailableItems__body}>
                <div className={styles.unavailableItems__nameRow}>
                  <h3 className={styles.unavailableItems__name} title={item.name}>
                    {item.name}
                  </h3>
                  <button
                    className={styles.unavailableItems__removeItemBtn}
                    aria-label={`Remove ${item.name}`}
                    onClick={() => onRemoveItem(item.originalIndex)}
                    disabled={isRemoving}
                    type="button"
                  >
                    <TrashIcon />
                  </button>
                </div>

                <UIBadge variant="danger">
                  {UNAVAILABILITY_BADGES[item.__typename] ?? 'Unavailable'}
                </UIBadge>

                <span className={styles.unavailableItems__qty}>
                  Qty: {item.quantity}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default UnavailableItems
