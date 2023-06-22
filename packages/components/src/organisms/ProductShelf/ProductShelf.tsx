import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface ProductShelfProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
}

const ProductShelf = forwardRef<HTMLDivElement, ProductShelfProps>(
  function ProductShelf(
    { testId = 'fs-product-shelf', children, ...otherProps },
    ref
  ) {
    return (
      <div
        ref={ref}
        data-fs-product-shelf
        data-fs-content="product-shelf"
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </div>
    )
  }
)

export default ProductShelf
