import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface CartItemImageProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
}

const CartItemImage = forwardRef<HTMLDivElement, CartItemImageProps>(
  function CartItemImage(
    { testId = 'fs-cart-item-image', children, ...otherProps },
    ref
  ) {
    return (
      <div
        ref={ref}
        data-fs-cart-item-image
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </div>
    )
  }
)

export default CartItemImage
