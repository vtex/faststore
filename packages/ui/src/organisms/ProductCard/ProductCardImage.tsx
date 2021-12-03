import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface ProductCardImageProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const ProductCardImage = forwardRef<HTMLDivElement, ProductCardImageProps>(
  function ProductCardImage(
    { testId = 'store-product-card-image', children, ...otherProps },
    ref
  ) {
    return (
      <div
        ref={ref}
        data-store-product-card-image
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </div>
    )
  }
)

export default ProductCardImage
