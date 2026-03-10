import React, { useState } from 'react'
import Button from '../../atoms/Button'
import Icon from '../../atoms/Icon'
import Price, { type PriceFormatter } from '../../atoms/Price'
import { useQuickOrderDrawer } from './provider/QuickOrderDrawerProvider'

export type QuickOrderDrawerFooterProps = {
  formatter?: PriceFormatter
  /**
   * Text labels for CMS configuration
   */
  labels?: {
    itemsLabel?: string
    addToCartLabel?: string
    addToCartAriaLabel?: string
  }
}

const QuickOrderDrawerFooter = ({
  formatter,
  labels,
}: QuickOrderDrawerFooterProps) => {
  const [loading, setLoading] = useState(false)
  const {
    itemsCount,
    totalPrice,
    onAddToCart,
    formatter: contextFormatter,
  } = useQuickOrderDrawer()
  const priceFormatter = formatter || contextFormatter
  const { itemsLabel, addToCartLabel, addToCartAriaLabel } = labels || {}

  const handleAddToCart = async () => {
    if (itemsCount === 0) return
    setLoading(true)
    try {
      onAddToCart()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div data-fs-quick-order-drawer-footer>
      <div data-fs-quick-order-drawer-footer-items>
        <Icon name="Inventory" width={24} height={24} />
        <span>
          {itemsCount} {itemsLabel || ''}
        </span>
      </div>
      <div data-fs-quick-order-drawer-footer-actions>
        <Price
          value={totalPrice}
          variant="selling"
          formatter={priceFormatter}
        />
        <Button
          data-fs-quick-order-drawer-add-to-cart-btn
          variant="primary"
          disabled={itemsCount === 0}
          loading={loading}
          onClick={handleAddToCart}
          aria-label={addToCartAriaLabel ?? `Add ${itemsCount} items to cart`}
        >
          {addToCartLabel || ''}
        </Button>
      </div>
    </div>
  )
}

export default QuickOrderDrawerFooter
