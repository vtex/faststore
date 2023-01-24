import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface ProductCardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Sets a border to the component.
   */
  bordered?: boolean
  /**
   * Sets the component's size.
   */
  variant?: 'wide' | 'default'
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  function ProductCard(
    {
      testId = 'fs-product-card',
      variant = 'default',
      bordered = false,
      children,
      ...otherProps
    },
    ref
  ) {
    return (
      <article
        ref={ref}
        data-fs-product-card
        data-fs-product-card-variant={variant}
        data-fs-product-card-bordered={bordered}
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </article>
    )
  }
)

export default ProductCard
