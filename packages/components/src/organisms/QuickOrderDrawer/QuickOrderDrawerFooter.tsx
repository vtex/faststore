import React, { useState } from 'react'
import Button from '../../atoms/Button'
import Price, { type PriceFormatter } from '../../atoms/Price'
import { useQuickOrderDrawer } from './provider/QuickOrderDrawerProvider'

export type QuickOrderDrawerFooterProps = {
  formatter?: PriceFormatter
}

const QuickOrderDrawerFooter = ({ formatter }: QuickOrderDrawerFooterProps) => {
  const [loading, setLoading] = useState(false)
  const {
    itemsCount,
    totalPrice,
    onAddToCart,
    formatter: contextFormatter,
  } = useQuickOrderDrawer()
  const priceFormatter = formatter || contextFormatter

  const handleAddToCart = () => {
    if (loading || itemsCount === 0) return
    setLoading(true)
    onAddToCart()
    setLoading(false)
  }

  return (
    <div data-fs-quick-order-drawer-footer>
      <div data-fs-quick-order-drawer-footer-price-container>
        <span>{itemsCount} items</span>
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
        aria-label={`Add ${itemsCount} items to cart`}
      >
        Add to Cart
      </Button>
    </div>
  )
}

export default QuickOrderDrawerFooter
