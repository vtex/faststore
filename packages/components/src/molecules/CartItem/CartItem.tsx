import React, { forwardRef, useCallback } from 'react'
import type { HTMLAttributes, MouseEvent } from 'react'

import { QuantitySelector, Price, IconButton } from '../../index'
import { XCircle } from '../../assets'

export interface CartItemProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
  /**
   * Specifies product Price.
   */
  price?: number
  /**
   * Specifies product List Price.
   */
  listPrice?: number
  /**
   * Specifies the quantity of items of the same product.
   */
  quantity?: number
  /**
   * Specifies that this product is unavailable.
   */
  unavailable?: boolean
  /**
   * Function called when remove button is clicked.
   */
  onClose?: (event: MouseEvent<HTMLElement>) => void
  /**
   * Event emitted when product value is changed.
   */
  onQuantityChange?: (value: number) => void
}

const CartItem = forwardRef<HTMLDivElement, CartItemProps>(function CartItem(
  {
    testId = 'fs-cart-item',
    price = 0,
    listPrice = 0,
    quantity,
    unavailable,
    onQuantityChange,
    onClose,
    children,
    ...otherProps
  },
  ref
) {
  const handleClose = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (event.defaultPrevented) {
        return
      }

      onClose?.(event)
    },
    [onClose]
  )
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
        icon={<XCircle />}
        aria-label="Remove"
        onClick={handleClose}
      />
      <div data-fs-cart-item-actions>
        <QuantitySelector
          min={1}
          initial={quantity}
          onChange={onQuantityChange}
        />
        <span data-fs-cart-item-prices>
          <Price
            value={listPrice}
            formatter={priceFormatter}
            variant="listing"
          />
          <Price value={price} formatter={priceFormatter} variant="spot" />
        </span>
      </div>
    </article>
  )
})

export function priceFormatter(priceNumber: number) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(priceNumber)
  return formattedPrice
}

export default CartItem
