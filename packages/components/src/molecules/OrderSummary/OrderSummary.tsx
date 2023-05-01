import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

import { List } from '../../'

export interface OrderSummaryProps extends HTMLAttributes<HTMLUListElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Label for the subtotal value of the order. Will only show if subtotalValue is provided.
   */
  subtotalLabel?: string
  /**
   * Subtotal value of the order. If provided, subtotal label and value will be shown.
   */
  subtotalValue?: string
  /**
   * Label for the discount value for the order. Will only show if discountValue is provided.
   */
  discountLabel?: string
  /**
   * Discount value for the order. If provided, discount label and value will be shown.
   */
  discountValue?: string
  /**
   * Label for the total value of the order.
   */
  totalLabel?: string
  /**
   * Total value of the order.
   */
  totalValue?: string
}

const OrderSummary = forwardRef<HTMLUListElement, OrderSummaryProps>(
  function OrderSummary(
    {
      testId = 'fs-order-summary',
      subtotalLabel,
      subtotalValue,
      discountLabel = 'Discount',
      discountValue,
      totalLabel = 'Total',
      totalValue,
      ...otherProps
    },
    ref
  ) {
    return (
      <List
        ref={ref}
        data-fs-order-summary
        data-testid={testId}
        {...otherProps}
      >
        {subtotalValue ? (
          <li data-fs-order-summary-subtotal>
            <span
              data-fs-order-summary-subtotal-label
              data-testid={`${testId}-subtotal-label`}
            >
              {subtotalLabel}
            </span>
            <span
              data-fs-order-summary-subtotal-value
              data-testid={`${testId}-subtotal-value`}
            >
              {subtotalValue}
            </span>
          </li>
        ) : null}
        {discountValue ? (
          <li data-fs-order-summary-discount>
            <span
              data-fs-order-summary-discount-label
              data-testid={`${testId}-discount-label`}
            >
              {discountLabel}
            </span>
            <span
              data-fs-order-summary-discount-value
              data-testid={`${testId}-discount-value`}
            >
              {discountValue}
            </span>
          </li>
        ) : null}
        <li data-fs-order-summary-total>
          <span
            data-fs-order-summary-total-label
            data-testid={`${testId}-total-label`}
          >
            {totalLabel}
          </span>
          <span
            data-fs-order-summary-total-value
            data-testid={`${testId}-total-value`}
          >
            {totalValue}
          </span>
        </li>
      </List>
    )
  }
)

export default OrderSummary
