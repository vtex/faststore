import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface CartItemProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
}

const CartItem = forwardRef<HTMLDivElement, CartItemProps>(function CartItem(
  { testId = 'fs-cart-item', children, ...otherProps },
  ref
) {
  return (
    <article ref={ref} data-fs-cart-item data-testid={testId} {...otherProps}>
      {children}
    </article>
  )
})

export default CartItem
