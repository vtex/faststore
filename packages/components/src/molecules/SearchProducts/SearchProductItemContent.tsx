import React, { forwardRef, useCallback } from 'react'
import { ProductPrice } from '../..'
import SearchProductItemQuickOrder from './SearchProductItemQuickOrder'

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
  /**
   * Quick order condition.
   */
  quickOrder?: {
    enabled: boolean
    availability: boolean
    //FIXME - Remove optional prop
    buyProps?: {
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
      'data-testid': string
      'data-sku': string
      'data-seller': string
    }
  }
}

const SearchProductItemContent = forwardRef<
  HTMLElement,
  SearchProductItemContentProps
>(function SearchProductItemContent(
  { price, title, quickOrder, ...otherProps },
  ref
) {
  const renderProductItemContent = useCallback(() => {
    return (
      <>
        <p data-fs-search-product-item-title>{title}</p>
        {price.value !== 0 && (
          <ProductPrice
            data-fs-search-product-item-prices
            listPrice={price.listPrice}
            value={price.value}
            formatter={price.formatter}
          />
        )}
      </>
    )
  }, [quickOrder?.enabled])

  return (
    <section ref={ref} data-fs-search-product-item-content {...otherProps}>
      {!quickOrder?.enabled && renderProductItemContent()}

      {quickOrder?.enabled && (
        <SearchProductItemQuickOrder
          availability={quickOrder.availability}
          {...quickOrder.buyProps}
        >
          {renderProductItemContent()}
        </SearchProductItemQuickOrder>
      )}
    </section>
  )
})

export default SearchProductItemContent
