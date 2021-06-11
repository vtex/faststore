import type { HTMLAttributes, ElementType, ReactNode } from 'react'
import React, { forwardRef } from 'react'

export type PriceFormatter = (price: number, variant: PriceVariant) => ReactNode

export type PriceVariant =
  | 'default'
  | 'listing'
  | 'spot'
  | 'savings'
  | 'installment'

export interface PriceProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  as?: ElementType
  testId?: string
  value: number
  formatter?: PriceFormatter
  variant?: PriceVariant
}

export const Price = forwardRef<Omit<HTMLSpanElement, 'children'>, PriceProps>(
  function Price(
    {
      as: Component = 'span',
      testId = 'store-price',
      value,
      formatter = (price) => price,
      variant = 'default',
      ...rawProps
    },
    ref
  ) {
    const formattedPrice = formatter(value, variant)

    const props = {
      // If it's false, we want to set it as undefined
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      [`data-store-price-${variant}`]: Boolean(variant) || undefined,
      ...rawProps,
    }

    return (
      <Component ref={ref} data-store-price data-testid={testId} {...props}>
        {formattedPrice}
      </Component>
    )
  }
)

export default Price
