import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface ProductCardPriceProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const ProductCardPrice = forwardRef<HTMLDivElement, ProductCardPriceProps>(
  function ProductCardPrice(
    { testId = 'store-product-card-price', children, ...otherProps },
    ref
  ) {
    return (
      <div
        ref={ref}
        data-store-product-card-price
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </div>
    )
  }
)

export default ProductCardPrice
