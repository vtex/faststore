import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

import type { PriceFormatter } from '../../atoms/Price'
import { Price } from '../../'

export interface ProductPriceProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Specifies product's raw price value.
   */
  value: number
  /**
   * Specifies product's listing price.
   */
  listPrice: number
  /**
   * Formatter function that transforms the raw price value and render the result.
   */
  formatter?: PriceFormatter
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

const ProductPrice = forwardRef<HTMLDivElement, ProductPriceProps>(
  function ProductCard(
    { testId = 'fs-product-price', value, listPrice, formatter, ...otherProps },
    ref
  ) {
    const listingPrice = listPrice ?? 0
    const sellingPrice = value ?? 0

    return (
      <div ref={ref} data-fs-product-price data-testid={testId} {...otherProps}>
        {sellingPrice !== listingPrice && listingPrice !== 0 ? (
          <>
            <Price
              value={listingPrice}
              formatter={formatter}
              testId="list-price"
              data-value={listingPrice}
              variant="listing"
              SRText="Original price:"
            />
            <Price
              value={sellingPrice}
              formatter={formatter}
              testId="price"
              data-value={sellingPrice}
              variant="spot"
              SRText="Price:"
            />
          </>
        ) : (
          <Price
            value={sellingPrice}
            formatter={formatter}
            testId="price"
            data-value={sellingPrice}
            variant="spot"
            SRText="Price:"
          />
        )}
      </div>
    )
  }
)

export default ProductPrice
