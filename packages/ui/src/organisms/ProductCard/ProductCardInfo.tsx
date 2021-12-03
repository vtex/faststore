import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface ProductCardInfoProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const ProductCardInfo = forwardRef<HTMLDivElement, ProductCardInfoProps>(
  function ProductCardInfo(
    { testId = 'store-product-card-info', children, ...otherProps },
    ref
  ) {
    return (
      <div
        ref={ref}
        role="region"
        data-store-product-card-info
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </div>
    )
  }
)

export default ProductCardInfo
