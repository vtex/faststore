import type { HTMLAttributes, ElementType, ReactNode } from 'react'
import React, { forwardRef } from 'react'

export type PriceVariant =
  | 'selling'
  | 'listing'
  | 'spot'
  | 'savings'
  | 'installment'

export type PriceFormatter = (price: number, variant: PriceVariant) => ReactNode

export interface PriceProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * Set the HTML element tag of this component.
   */
  as?: ElementType
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * The raw price value.
   */
  value: number
  /**
   * Formatter function that transforms the raw price value and render the result.
   */
  formatter?: PriceFormatter
  /**
   * The current use case variant for prices.
   */
  variant?: PriceVariant
}

const Price = forwardRef<Omit<HTMLSpanElement, 'children'>, PriceProps>(
  function Price(
    {
      value,
      as: Component = 'span',
      variant = 'selling',
      testId = 'fs-price',
      formatter = (price) => price,
      ...otherProps
    },
    ref
  ) {
    const formattedPrice = formatter(value, variant)

    return (
      <Component
        ref={ref}
        data-fs-price
        data-testid={testId}
        data-fs-variant={variant}
        {...otherProps}
      >
        {formattedPrice}
      </Component>
    )
  }
)

export default Price
