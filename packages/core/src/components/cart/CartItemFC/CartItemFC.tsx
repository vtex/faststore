import {
  Icon as UIIcon,
  ProductPrice as UIProductPrice,
  QuantitySelector as UIQuantitySelector,
  Badge as UIBadge,
} from '@faststore/ui'

import { Image } from 'src/components/ui/Image'
import { useFormattedPrice } from 'src/sdk/product/useFormattedPrice'
import type {
  CartItemDisplayData,
  ItemMutationState,
} from 'src/sdk/fastcheckout/types'

import CartComposition from '../CartComposition/CartComposition'
import styles from './CartItemFC.module.scss'

function TrashIcon({ width = 18, height = 18 }: { width?: number; height?: number }) {
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

interface CartItemFCProps {
  item: CartItemDisplayData
  mutationState: ItemMutationState
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}

function CartItemFC({
  item,
  mutationState,
  onQuantityChange,
  onRemove,
}: CartItemFCProps) {
  const stateClass = mutationState !== 'idle'
    ? styles[`cartItemFC--${mutationState}`]
    : ''

  const isInteractive = mutationState === 'idle' || mutationState === 'error'

  return (
    <div className={`${styles.cartItemFC} ${stateClass}`}>
      {item.imageUrl ? (
        <div className={styles.cartItemFC__image}>
          <Image
            src={item.imageUrl}
            alt={item.imageAlt}
            width={72}
            height={72}
          />
        </div>
      ) : (
        <div className={styles.cartItemFC__placeholderImage}>
          <UIIcon name="ShoppingCart" width={24} height={24} />
        </div>
      )}

      <div className={styles.cartItemFC__body}>
        <div className={styles.cartItemFC__header}>
          <h3 className={styles.cartItemFC__name} title={item.name}>
            {item.name}
          </h3>
          <button
            className={styles.cartItemFC__removeBtn}
            aria-label={`Remove ${item.name} from cart`}
            onClick={onRemove}
            disabled={!isInteractive}
            type="button"
          >
            <TrashIcon />
          </button>
        </div>

        {item.sellerName && (
          <span className={styles.cartItemFC__seller}>
            Sold by {item.sellerName}
          </span>
        )}

        {item.tags.length > 0 && (
          <div className={styles.cartItemFC__tags}>
            {item.tags.map((tag) => (
              <UIBadge key={tag} variant="highlighted">
                {tag}
              </UIBadge>
            ))}
          </div>
        )}

        <div className={styles.cartItemFC__pricing}>
          <UIProductPrice
            value={item.sellingPrice}
            listPrice={item.listPrice}
            formatter={useFormattedPrice}
          />
        </div>

        <div className={styles.cartItemFC__controls}>
          <UIQuantitySelector
            min={1}
            initial={item.quantity}
            onChange={onQuantityChange}
            disabled={!isInteractive}
          />
        </div>

        {item.hasCompositions && (
          <CartComposition compositions={item.compositions} />
        )}

        {mutationState === 'error' && (
          <p className={styles.cartItemFC__errorMessage}>
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </div>
  )
}

export default CartItemFC
