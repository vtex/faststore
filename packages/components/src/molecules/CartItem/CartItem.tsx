import type { HTMLAttributes, ReactNode } from 'react'
import React, { forwardRef } from 'react'

import { XCircle } from '../../assets'
import {
  IconButton,
  IconButtonProps,
  Price,
  QuantitySelector,
} from '../../index'

export type PriceVariant =
  | 'selling'
  | 'listing'
  | 'spot'
  | 'savings'
  | 'installment'

export type PriceFormatter = (price: number, variant: PriceVariant) => ReactNode

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
   * Formatter function that transforms the raw price value and renders the result.
   */
  formatter?: PriceFormatter
  /**
   * Event emitted when product value is changed.
   */
  onQuantityChange?: (value: number) => void
  /**
   * Props for the Remove from cart IconButton component.
   */
  removeBtnProps?: Partial<IconButtonProps>
}

const CartItem = forwardRef<HTMLDivElement, CartItemProps>(function CartItem(
  {
    testId = 'fs-cart-item',
    price = 0,
    listPrice = 0,
    quantity,
    unavailable,
    formatter,
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
        icon={<XCircle />}
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
          <Price value={listPrice} formatter={formatter} variant="listing" />
          <Price value={price} formatter={formatter} variant="spot" />
        </span>
      </div>
    </article>
  )
})

export default CartItem
