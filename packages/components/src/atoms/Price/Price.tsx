import type { HTMLAttributes, ElementType, ReactNode } from 'react'
import React, { forwardRef } from 'react'

import { SROnly } from '../../'

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
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Set the HTML element tag of this component.
   */
  as?: ElementType
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
  /**
   * Text for the screen readers only
   */
  SRText?: string
}

const Price = forwardRef<Omit<HTMLSpanElement, 'children'>, PriceProps>(
  function Price(
    {
      value,
      as: Component = 'span',
      variant = 'selling',
      testId = 'fs-price',
      formatter = (price) => price,
      SRText,
      ...otherProps
    },
    ref
  ) {
    const formattedPrice = formatter(value, variant)

    return (
      <Component
        ref={ref}
        data-fs-price
        data-fs-price-variant={variant}
        data-testid={testId}
        {...otherProps}
      >
        {SRText && <SROnly text={SRText} />}
        {formattedPrice}
      </Component>
    )
  }
)

export default Price
