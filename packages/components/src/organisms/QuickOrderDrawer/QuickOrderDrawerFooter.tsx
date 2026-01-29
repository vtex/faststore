import React from 'react'
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
  const {
    itemsCount,
    totalPrice,
    onAddToCart,
    formatter: contextFormatter,
  } = useQuickOrderDrawer()
  const priceFormatter = formatter || contextFormatter
  const { itemsLabel, addToCartLabel, addToCartAriaLabel } = labels || {}

  const handleAddToCart = () => {
    if (itemsCount === 0) return
    onAddToCart()
  }

  return (
    <div data-fs-quick-order-drawer-footer>
      <div data-fs-quick-order-drawer-footer-price-container>
        <span>
          {itemsCount} {itemsLabel || ''}
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
        disabled={itemsCount === 0}
        onClick={handleAddToCart}
        aria-label={addToCartAriaLabel}
      >
        {addToCartLabel || ''}
      </Button>
    </div>
  )
}

export default QuickOrderDrawerFooter
