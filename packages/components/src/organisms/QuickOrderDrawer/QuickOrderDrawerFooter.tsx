import React, { useState } from 'react'
import Button from '../../atoms/Button'
import Price, { type PriceFormatter } from '../../atoms/Price'
import { useQuickOrderDrawer } from './provider/QuickOrderDrawerProvider'

export type QuickOrderDrawerFooterProps = {
  formatter?: PriceFormatter
}

const QuickOrderDrawerFooter = ({ formatter }: QuickOrderDrawerFooterProps) => {
  const [loading, _setLoading] = useState(false)
  const { itemsCount, totalPrice } = useQuickOrderDrawer()

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
        aria-label={`Add ${itemsCount} items to cart`}
      >
        Add to Cart
      </Button>
    </div>
  )
}

export default QuickOrderDrawerFooter
