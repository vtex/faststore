import React, { forwardRef } from 'react'
import { Price } from '../..'

import type { PriceDefinition } from '../../typings/PriceDefinition'

export interface SearchProductItemContentProps {
  /**
   * Specifies the product's title.
   */
  title: string
  /**
   * Specifies product's prices.
   */
  price: PriceDefinition
}

const SearchProductItemContent = forwardRef<
  HTMLElement,
  SearchProductItemContentProps
>(function SearchProductItemContent({ price, title, ...otherProps }, ref) {
  return (
    <section ref={ref} data-fs-search-product-item-content {...otherProps}>
      <p data-fs-search-product-item-title>{title}</p>
      <span data-fs-search-product-item-prices>
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

export default SearchProductItemContent
