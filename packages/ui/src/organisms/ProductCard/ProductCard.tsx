import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface ProductCardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  function ProductCard(
    { testId = 'store-product-card', children, ...otherProps },
    ref
  ) {
    return (
      <article
        ref={ref}
        data-store-product-card
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </article>
    )
  }
)

export default ProductCard
