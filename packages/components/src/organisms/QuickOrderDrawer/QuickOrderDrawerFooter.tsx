import React, { useState } from 'react'
import Button from '../../atoms/Button'
import Price, { type PriceFormatter } from '../../atoms/Price'
import { useQuickOrderDrawer } from './provider/QuickOrderDrawerProvider'

export type QuickOrderDrawerFooterProps = {
  formatter?: PriceFormatter
}

const QuickOrderDrawerFooter = ({ formatter }: QuickOrderDrawerFooterProps) => {
  const [loading, setLoading] = useState(false)
  const { itemsCount, totalPrice, onAddToCart } = useQuickOrderDrawer()

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      onAddToCart()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div data-fs-qod-footer>
      <div data-fs-qod-footer-price-container>
        <span>{itemsCount} items</span>
        <Price value={totalPrice} variant="selling" formatter={formatter} />
      </div>
      <Button
        data-fs-qod-add-to-cart-btn
        variant="primary"
        loading={loading}
        onClick={handleAddToCart}
        aria-label={`Add ${itemsCount} items to cart`}
      >
        Add to Cart
      </Button>
    </div>
  )
}

export default QuickOrderDrawerFooter
