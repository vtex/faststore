import { useCallback } from 'react'
import type { BffProduct } from 'src/sdk/checkout/operations/cartOperations'

import styles from './cart-page.module.scss'

interface CartPageCartItemProps {
  item: BffProduct
  currencyCode: string
  locale: string
  onQuantityChange: (itemIndex: number, quantity: number) => void
  onRemove: (itemIndex: number) => void
}

function formatPrice(value: number, currencyCode: string, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(value)
}

function CartPageCartItem({
  item,
  currencyCode,
  locale,
  onQuantityChange,
  onRemove,
}: CartPageCartItemProps) {
  const handleQuantityChange = useCallback(
    (newQuantity: number) => {
      if (newQuantity < 1) {
        onRemove(item.originalIndex)
        return
      }
      onQuantityChange(item.originalIndex, newQuantity)
    },
    [item.originalIndex, onQuantityChange, onRemove]
  )

  const handleRemove = useCallback(() => {
    onRemove(item.originalIndex)
  }, [item.originalIndex, onRemove])

  const { price } = item
  let sellingPrice: number
  let formattedListPrice: string | null = null

  if (price.__typename === 'PriceWithDiscount') {
    sellingPrice = price.valueWithDiscount.asNumber
    formattedListPrice = formatPrice(price.value.asNumber, currencyCode, locale)
  } else {
    sellingPrice = price.value.asNumber
  }

  const formattedPrice = formatPrice(sellingPrice, currencyCode, locale)

  return (
    <div className={styles.itemCard} data-fs-cart-page-item>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <a href={item.productUrl} style={{ flexShrink: 0 }}>
          <img
            src={item.imageUrl}
            alt={item.name}
            width={80}
            height={80}
            style={{ objectFit: 'contain', borderRadius: '0.25rem' }}
          />
        </a>

        <div style={{ flex: 1, minWidth: 0 }}>
          <a
            href={item.productUrl}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <p
              style={{
                margin: '0 0 0.25rem',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              {item.name}
            </p>
          </a>

          {item.skuName && item.skuName !== item.name && (
            <p
              style={{
                margin: '0 0 0.5rem',
                fontSize: '0.75rem',
                color: '#757575',
              }}
            >
              {item.skuName}
            </p>
          )}

          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                aria-label="Decrease quantity"
                style={{
                  width: '2rem',
                  height: '2rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: '0.25rem',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                −
              </button>
              <span
                style={{
                  minWidth: '1.5rem',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                }}
              >
                {item.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                aria-label="Increase quantity"
                style={{
                  width: '2rem',
                  height: '2rem',
                  border: '1px solid #e0e0e0',
                  borderRadius: '0.25rem',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                +
              </button>
            </div>

            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              {formattedListPrice && (
                <span
                  style={{
                    textDecoration: 'line-through',
                    color: '#757575',
                    fontSize: '0.75rem',
                    display: 'block',
                  }}
                >
                  {formattedListPrice}
                </span>
              )}
              <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                {formattedPrice}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleRemove}
          aria-label={`Remove ${item.name} from cart`}
          style={{
            alignSelf: 'flex-start',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.25rem',
            color: '#757575',
            padding: '0.25rem',
          }}
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default CartPageCartItem
