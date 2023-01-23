import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface ProductCardActionsProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const ProductCardActions = forwardRef<HTMLDivElement, ProductCardActionsProps>(
  function CardActions(
    { testId = 'fs-product-card-actions', children, ...otherProps },
    ref
  ) {
    return (
      <div
        ref={ref}
        data-fs-product-card-actions
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </div>
    )
  }
)

export default ProductCardActions
