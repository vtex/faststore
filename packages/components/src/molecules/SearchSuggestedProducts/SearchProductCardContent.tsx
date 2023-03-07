import React, { forwardRef } from 'react'
import { Price } from '../..'
import type { PriceFormatter } from '../../atoms/Price/Price'

interface Price {
  value: number
  listPrice: number
  formatter: PriceFormatter
}

export type SearchProductCardContentProps = {
  /**
   * Specifies the product's title.
   */
  title: string
  /**
   * Specifies product's prices.
   */
  price: Price
}

const SearchProductCardContent = forwardRef<
  HTMLElement,
  SearchProductCardContentProps
>(function SearchProductCardContent({ price, title, ...otherProps }, ref) {
  return (
    <section ref={ref} data-fs-search-product-card-content {...otherProps}>
      <p data-fs-search-product-card-title>{title}</p>
      <span data-fs-search-product-card-prices>
        <Price
          value={price?.listPrice ? price.listPrice : 0}
          formatter={price?.formatter}
          testId="list-price"
          data-value={price?.listPrice}
          variant="listing"
          SRText="Original price:"
        />
        <Price
          value={price?.value ? price.value : 0}
          formatter={price?.formatter}
          testId="price"
          data-value={price?.value}
          variant="spot"
          SRText="Price:"
        />
      </span>
    </section>
  )
})

export default SearchProductCardContent
