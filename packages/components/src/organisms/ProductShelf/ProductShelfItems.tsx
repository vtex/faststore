import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface ProductShelfItemsProps
  extends HTMLAttributes<HTMLUListElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
}

const ProductShelfItems = forwardRef<HTMLUListElement, ProductShelfItemsProps>(
  function ProductShelfItems(
    { testId = 'fs-product-shelf-items', children, ...otherProps },
    ref
  ) {
    return (
      <ul
        role="list"
        ref={ref}
        data-fs-product-shelf-items
        data-fs-content="product-shelf"
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </ul>
    )
  }
)

export default ProductShelfItems
