import React, { forwardRef, useCallback } from 'react'
import { ProductPrice } from '../..'
import SearchProductItemControl from './SearchProductItemControl'

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
    hasVariants: boolean
    skuMatrixControl: React.ReactNode
		quantity: number,
		onChangeQuantity(value: number): void
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
        <SearchProductItemControl
          availability={quickOrder.availability}
          hasVariants={quickOrder.hasVariants}
          skuMatrixControl={quickOrder.skuMatrixControl}
					quantity={quickOrder.quantity}
					onChangeQuantity={quickOrder.onChangeQuantity}
          {...quickOrder.buyProps}
        >
          {renderProductItemContent()}
        </SearchProductItemControl>
      )}
    </section>
  )
})

export default SearchProductItemContent
