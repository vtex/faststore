import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface CartItemSummaryProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
  /**
   * Specifies the product's title.
   */
  title: string
  /**
   * Array of the product's chosen variations.
   */
  activeVariations?: Array<{ label: string; option: string }>
}

const CartItemSummary = forwardRef<HTMLDivElement, CartItemSummaryProps>(
  function CartItemSummary(
    {
      testId = 'fs-cart-item-summary',
      title,
      activeVariations = [],
      children,
      ...otherProps
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        data-fs-cart-item-summary
        data-testid={testId}
        {...otherProps}
      >
        <div data-fs-cart-item-title>{title}</div>
        {activeVariations.length > 0 && (
          <div data-fs-cart-item-skus>
            {activeVariations.map(({ label, option }) => (
              <p key={label}>
                {label}: <span>{option}</span>
              </p>
            ))}
          </div>
        )}
        {children}
      </div>
    )
  }
)

export default CartItemSummary
