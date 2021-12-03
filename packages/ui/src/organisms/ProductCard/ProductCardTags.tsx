import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface ProductCardTagsProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const ProductCardTags = forwardRef<HTMLDivElement, ProductCardTagsProps>(
  function ProductCardTags(
    { testId = 'store-product-card-tags', children, ...otherProps },
    ref
  ) {
    return (
      <div
        ref={ref}
        data-store-product-card-tags
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </div>
    )
  }
)

export default ProductCardTags
