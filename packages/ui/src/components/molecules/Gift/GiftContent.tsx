import type { ComponentProps } from 'react'
import React from 'react'

import { Price, Badge } from '../../'

import type { PriceDefinition } from '../../typings/PriceDefinition'

export interface GiftContentProps extends ComponentProps<'div'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
  /**
   * Specifies the product's name.
   */
  productName: string
  /**
   * Specifies product's prices.
   */
  price: PriceDefinition
  /**
   * Badge's label
   */
  badgeLabel?: string
  /**
   * Additional message in the title
   */
  titleMessage?: string
}

export default function GiftContent({
  price,
  productName,
  titleMessage = 'Get a',
  badgeLabel = 'Free',
  testId = 'fs-gift-content',
  ref,
  ...otherProps
}: GiftContentProps) {
  return (
    <section
      ref={ref}
      data-fs-gift-content
      data-testid={testId}
      {...otherProps}
    >
      <h3 data-fs-gift-product-title>
        {titleMessage} {productName}
      </h3>
      <span data-fs-gift-product-summary>
        <Price
          value={price?.listPrice ? price.listPrice : 0}
          formatter={price?.formatter}
          testId="list-price"
          data-value={price?.listPrice}
          variant="listing"
          SRText="Original price:"
        />
        <Badge>{badgeLabel}</Badge>
      </span>
    </section>
  )
}
