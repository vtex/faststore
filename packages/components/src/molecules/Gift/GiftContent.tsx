import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

import { Price, Badge } from '../../'

import type { PriceDefinition } from '../../typings/PriceDefinition'

export interface GiftContentProps extends HTMLAttributes<HTMLElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
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

const GiftContent = forwardRef<HTMLElement, GiftContentProps>(
  function GiftContent(
    {
      price,
      productName,
      titleMessage = 'Get a',
      badgeLabel = 'Free',
      testId = 'fs-gift-content',
      ...otherProps
    },
    ref
  ) {
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
)

export default GiftContent
