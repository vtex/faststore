import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface CartItemSummaryProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
}

const CartItemSummary = forwardRef<HTMLDivElement, CartItemSummaryProps>(
  function CartItemSummary(
    { testId = 'store-cart-item-summary', children, ...otherProps },
    ref
  ) {
    return (
      <div ref={ref} data-fs-cart-item-summary data-testid={testId} {...otherProps}>
        {children}
      </div>
    )
  }
)

export default CartItemSummary
