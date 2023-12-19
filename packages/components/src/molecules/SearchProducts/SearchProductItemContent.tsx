import React, { forwardRef } from 'react'
import { ProductPrice } from '../..'

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

      {price.value !== 0 && (
        <ProductPrice
          data-fs-search-product-item-prices
          price={{
            listPrice: price.listPrice,
            value: price.value,
            formatter: price.formatter,
          }}
        />
      )}
    </section>
  )
})

export default SearchProductItemContent
