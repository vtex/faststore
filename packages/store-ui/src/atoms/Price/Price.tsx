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

export const Price = forwardRef<Omit<HTMLSpanElement, 'children'>, PriceProps>(
  function Price(
    {
      as: Component = 'span',
      testId = 'store-price',
      value,
      formatter = (price) => price,
      variant = 'selling',
      ...rawOtherProps
    },
    ref
  ) {
    const formattedPrice = formatter(value, variant)

    const otherProps = {
      [`data-${variant}`]: true,
      ...rawOtherProps,
    }

    return (
      <Component
        ref={ref}
        data-store-price
        data-testid={testId}
        {...otherProps}
      >
        {formattedPrice}
      </Component>
    )
  }
)

export default Price
