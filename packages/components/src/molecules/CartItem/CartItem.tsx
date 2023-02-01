import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

import { XCircle } from '../../assets'
import {
  IconButton,
  IconButtonProps,
  Price,
  QuantitySelector,
} from '../../index'

import type { PriceFormatter } from '../../atoms/Price/Price'

interface Price {
  value: number
  listPrice: number
  formatter: PriceFormatter
}

export interface CartItemProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: Cypress, Testing Library, and Jest).
   */
  testId?: string
  /**
   * Specifies product Price.
   */
  price?: Price
  /**
   * Specifies the quantity of items of the same product.
   */
  quantity?: number
  /**
   * Specifies that this product is unavailable.
   */
  unavailable?: boolean
  /**
   * Event emitted when product quantity value is changed.
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
          <Price
            value={price?.listPrice ? price.listPrice : 0}
            formatter={price?.formatter}
            variant="listing"
          />
          <Price
            value={price?.value ? price.value : 0}
            formatter={price?.formatter}
            variant="spot"
          />
        </span>
      </div>
    </article>
  )
})

export default CartItem
