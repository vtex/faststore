import type { HTMLAttributes, ReactNode } from 'react'
import React, { forwardRef } from 'react'

import { Link, Price, BuyButton } from '../../index'

export type PriceVariant =
  | 'selling'
  | 'listing'
  | 'spot'
  | 'savings'
  | 'installment'

export type PriceFormatter = (price: number, variant: PriceVariant) => ReactNode

export interface ProductCardContentProps extends HTMLAttributes<HTMLElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Specifies the product's title.
   */
  title: string
  /**
   * Specifies product Price.
   */
  price?: number
  /**
   * Specifies product List Price.
   */
  listPrice?: number
  /**
   * Enables a BuyButton to the component.
   */
  buyButton?: boolean
  /**
   * Formatter function that transforms the raw price value and render the result.
   */
  formatter?: PriceFormatter
}

const ProductCardContent = forwardRef<HTMLElement, ProductCardContentProps>(
  function CardContent(
    {
      testId = 'fs-product-card-content',
      buyButton,
      title,
      price = 0,
      listPrice = 0,
      formatter,
      children,
      ...otherProps
    },
    ref
  ) {
    return (
      <section
        ref={ref}
        data-fs-product-card-content
        data-testid={testId}
        {...otherProps}
      >
        <div data-fs-product-card-heading>
          <h3 data-fs-product-card-title>
            <Link title={title}>{title}</Link>
          </h3>
          <div data-fs-product-card-prices>
            <Price
              value={listPrice}
              formatter={formatter}
              testId="list-price"
              data-value={listPrice}
              variant="listing"
            />
            <Price
              value={price}
              formatter={formatter}
              testId="price"
              data-value={price}
              variant="spot"
            />
          </div>
        </div>
        {!!buyButton && (
          <div data-fs-product-card-actions>
            <BuyButton size="small">Buy Now</BuyButton>
          </div>
        )}
      </section>
    )
  }
)

export default ProductCardContent
