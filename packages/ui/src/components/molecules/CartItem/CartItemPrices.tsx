import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface CartItemPricesProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
}

const CartItemPrices = forwardRef<HTMLSpanElement, CartItemPricesProps>(
  function CartItemPrices(
    { testId = 'store-cart-item-prices', children, ...otherProps },
    ref
  ) {
    return (
      <span ref={ref} data-fs-cart-item-prices data-testid={testId} {...otherProps}>
        {children}
      </span>
    )
  }
)

export default CartItemPrices
