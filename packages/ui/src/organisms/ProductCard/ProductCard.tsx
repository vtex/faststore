import React, { forwardRef } from 'react'
import type { HTMLAttributes, MouseEvent } from 'react'

export interface ProductCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick' | 'role'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Event handler for clicks on the product card.
   */
  onClick?: (e: MouseEvent) => void
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
