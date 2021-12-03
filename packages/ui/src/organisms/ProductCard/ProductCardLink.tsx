import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface ProductCardLinkProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const ProductCardLink = forwardRef<HTMLDivElement, ProductCardLinkProps>(
  function ProductCardLink(
    { testId = 'store-product-card-link', children, ...otherProps },
    ref
  ) {
    return (
      <div
        ref={ref}
        data-store-product-card-link
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </div>
    )
  }
)

export default ProductCardLink
