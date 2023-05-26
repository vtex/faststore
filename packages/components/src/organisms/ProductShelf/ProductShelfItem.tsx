import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface ProductShelfItemProps extends HTMLAttributes<HTMLLIElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
}

const ProductShelfItem = forwardRef<HTMLLIElement, ProductShelfItemProps>(
  function ProductShelfItem(
    { testId = 'fs-product-shelf-item', children, ...otherProps },
    ref
  ) {
    return (
      <li
        role="listitem"
        ref={ref}
        data-fs-product-shelf-item
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </li>
    )
  }
)

export default ProductShelfItem
