import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface ProductGridProps extends HTMLAttributes<HTMLUListElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
}

const ProductGrid = forwardRef<HTMLUListElement, ProductGridProps>(
  function ProductGridItem(
    { testId = 'fs-product-grid', children, ...otherProps },
    ref
  ) {
    return (
      <ul ref={ref} data-fs-product-grid {...otherProps}>
        {children}
      </ul>
    )
  }
)

export default ProductGrid
