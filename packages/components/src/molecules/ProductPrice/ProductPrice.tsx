import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

import type { PriceDefinition } from '../../typings/PriceDefinition'
import { Price } from '../../'

export interface ProductPriceProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Specifies product's prices.
   */
  price?: PriceDefinition
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

const ProductPrice = forwardRef<HTMLDivElement, ProductPriceProps>(
  function ProductCard(
    { testId = 'fs-product-price', price, ...otherProps },
    ref
  ) {
    const listPrice = price?.listPrice ?? 0
    const sellingPrice = price?.value ?? 0

    return (
      <div ref={ref} data-fs-product-price data-testid={testId} {...otherProps}>
        {sellingPrice !== listPrice && listPrice !== 0 ? (
          <>
            <Price
              value={listPrice}
              formatter={price?.formatter}
              testId="list-price"
              data-value={listPrice}
              variant="listing"
              SRText="Original price:"
            />
            <Price
              value={sellingPrice}
              formatter={price?.formatter}
              testId="price"
              data-value={sellingPrice}
              variant="spot"
              SRText="Price:"
            />
          </>
        ) : (
          <Price
            value={sellingPrice}
            formatter={price?.formatter}
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
