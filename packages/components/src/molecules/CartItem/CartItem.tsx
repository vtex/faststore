import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

import { Icon, IconButton, IconButtonProps, Price, QuantitySelector } from '../../'

import type { PriceDefinition } from '../../typings/PriceDefinition'

export interface CartItemProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
  /**
   * Specifies product Price.
   */
  price?: PriceDefinition
  /**
   * Specifies the quantity of items of the same product.
   */
  quantity?: number
  /**
   * Specifies that this product is unavailable.
   */
  unavailable?: boolean
  /**
   * Props for the Remove from cart IconButton component.
   */
  removeBtnProps?: Partial<IconButtonProps>
  /**
   * Event emitted when product quantity value is changed.
   */
  onQuantityChange?: (value: number) => void
}

const CartItem = forwardRef<HTMLDivElement, CartItemProps>(function CartItem(
  {
    testId = 'fs-cart-item',
    price,
    quantity,
    unavailable,
    onQuantityChange,
    children,
    removeBtnProps,
    ...otherProps
  },
  ref
) {
  return (
    <article
      ref={ref}
      data-fs-cart-item={unavailable ? 'unavailable' : 'true'}
      data-testid={testId}
      {...otherProps}
    >
      <div data-fs-cart-item-content>{children}</div>
      <IconButton
        data-fs-cart-item-remove-button
        icon={<Icon name="XCircle" />}
        aria-label="Remove"
        {...removeBtnProps}
      />
      <div data-fs-cart-item-actions>
        <QuantitySelector
          min={1}
          initial={quantity}
          onChange={onQuantityChange}
        />
        <span data-fs-cart-item-prices>
          <Price
            value={price?.listPrice ? price.listPrice : 0}
            formatter={price?.formatter}
            variant="listing"
            SRText="Original price:"
          />
          <Price
            value={price?.value ? price.value : 0}
            formatter={price?.formatter}
            variant="spot"
            SRText="Price:"
          />
        </span>
      </div>
    </article>
  )
})

export default CartItem
