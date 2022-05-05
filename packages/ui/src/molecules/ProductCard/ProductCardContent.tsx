import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface ProductCardContentProps extends HTMLAttributes<HTMLElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const ProductCardContent = forwardRef<HTMLElement, ProductCardContentProps>(
  function CardContent(
    { testId = 'store-product-card-content', children, ...otherProps },
    ref
  ) {
    return (
      <section
        ref={ref}
        data-product-card-content
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </section>
    )
  }
)

export default ProductCardContent
