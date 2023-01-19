import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

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
}

const CartItem = forwardRef<HTMLDivElement, CartItemProps>(function CartItem(
  {
    testId = 'fs-cart-item',
    price = 0,
    listPrice = 0,
    quantity,
    unavailable,
    children,
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
        data-fs-cart-item-remove
        icon={<XCircle />}
        aria-label="Remove"
      />
      <div data-fs-cart-item-actions>
        <QuantitySelector min={1} initial={quantity} />
        <span data-fs-cart-item-prices>
          <Price
            value={listPrice}
            formatter={priceFormatter}
            data-value={listPrice}
            variant="listing"
          />
          <Price
            value={price}
            formatter={priceFormatter}
            data-value={price}
            variant="spot"
          />
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
