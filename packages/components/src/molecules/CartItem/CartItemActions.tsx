import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface CartItemActionsProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
}

const CartItemActions = forwardRef<HTMLDivElement, CartItemActionsProps>(
  function CartItemActions(
    { testId = 'fs-cart-item-actions', children, ...otherProps },
    ref
  ) {
    return (
      <div
        ref={ref}
        data-fs-cart-item-actions
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </div>
    )
  }
)

export default CartItemActions
