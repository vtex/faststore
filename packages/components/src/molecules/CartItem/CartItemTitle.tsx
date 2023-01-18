import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface CartItemTitleProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
}

const CartItemTitle = forwardRef<HTMLDivElement, CartItemTitleProps>(
  function CartItemTitle(
    { testId = 'fs-cart-item-title', children, ...otherProps },
    ref
  ) {
    return (
      <div
        ref={ref}
        data-fs-cart-item-title
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </div>
    )
  }
)

export default CartItemTitle
