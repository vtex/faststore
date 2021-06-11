import type { HTMLAttributes, ElementType, ReactNode } from 'react'
import React, { forwardRef } from 'react'

export type PriceFormatter = (price: number, listing: boolean) => ReactNode

export interface PriceProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  as?: ElementType
  testId?: string
  value: number
  formatter?: PriceFormatter
  listing?: boolean
}

export const Price = forwardRef<Omit<HTMLSpanElement, 'children'>, PriceProps>(
  function Price(
    {
      as: Component = 'span',
      testId = 'store-price',
      value,
      formatter = (price) => price,
      listing,
      ...rawProps
    },
    ref
  ) {
    const formattedPrice = formatter(value, Boolean(listing))

    const props = {
      // If it's false, we want to set it as undefined
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      'data-listing': listing || undefined,
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
