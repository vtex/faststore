import React, { useState } from 'react'
import Button from '../../atoms/Button'
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

  const itemsLabel = labels?.itemsLabel ?? 'items'
  const addToCartLabel = labels?.addToCartLabel ?? 'Add to Cart'
  const addToCartAriaLabel =
    labels?.addToCartAriaLabel ?? `Add ${itemsCount} items to cart`

  const handleAddToCart = () => {
    if (loading || itemsCount === 0) return
    setLoading(true)
    onAddToCart()
    setLoading(false)
  }

  return (
    <div data-fs-quick-order-drawer-footer>
      <div data-fs-quick-order-drawer-footer-price-container>
        <span>
          {itemsCount} {itemsLabel}
        </span>
        <Price
          value={totalPrice}
          variant="selling"
          formatter={priceFormatter}
        />
      </div>
      <Button
        data-fs-quick-order-drawer-add-to-cart-btn
        variant="primary"
        loading={loading}
        disabled={itemsCount === 0}
        onClick={handleAddToCart}
        aria-label={addToCartAriaLabel}
      >
        {addToCartLabel}
      </Button>
    </div>
  )
}

export default QuickOrderDrawerFooter
