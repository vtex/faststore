import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface ProductGridItemProps extends HTMLAttributes<HTMLLIElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
}

const ProductGridItem = forwardRef<HTMLLIElement, ProductGridItemProps>(
  function ProductGridItem(
    { testId = 'fs-product-grid-item', children, ...otherProps },
    ref
  ) {
    return (
      <li ref={ref} data-fs-product-grid-item {...otherProps}>
        {children}
      </li>
    )
  }
)

export default ProductGridItem
