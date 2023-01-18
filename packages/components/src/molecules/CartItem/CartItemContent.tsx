import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface CartItemContentProps extends HTMLAttributes<HTMLElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
}

const CartItemContent = forwardRef<HTMLElement, CartItemContentProps>(
  function CartItemContent(
    { testId = 'fs-cart-item-content', children, ...otherProps },
    ref
  ) {
    return (
      <section
        ref={ref}
        data-fs-cart-item-content
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </section>
    )
  }
)

export default CartItemContent
