import type React from 'react'
import { type Ref, useCallback } from 'react'
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
   * Quick order settings.
   */
  quickOrder?: {
    enabled: boolean
    outOfStockLabel: string
    availability: boolean
    hasVariants: boolean
    skuMatrixControl: React.ReactNode
    quantity: number
    min?: number
    max?: number
    onChangeQuantity(value: number): void
    buyProps?: {
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
      'data-testid': string
      'data-sku': string
      'data-seller': string
    }
  }
  /**
   * Event emitted when value is out of the min and max bounds
   */
  onValidateBlur?: (min: number, maxValue: number, quantity: number) => void
  /**
   * Component's ref
   */
  ref?: Ref<HTMLDivElement>
}

export default function SearchProductItemContent({
  price,
  title,
  quickOrder,
  onValidateBlur,
  ref,
  ...otherProps
}: SearchProductItemContentProps) {
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
  }, [price.formatter, price.listPrice, price.value, title])

  return (
    <section ref={ref} data-fs-search-product-item-content {...otherProps}>
      {!quickOrder?.enabled && renderProductItemContent()}

      {quickOrder?.enabled && (
        <SearchProductItemControl
          outOfStockLabel={quickOrder.outOfStockLabel}
          availability={quickOrder.availability}
          hasVariants={quickOrder.hasVariants}
          skuMatrixControl={quickOrder.skuMatrixControl}
          quantity={quickOrder.quantity}
          onChangeQuantity={quickOrder.onChangeQuantity}
          max={quickOrder.max}
          onValidateBlur={onValidateBlur}
          {...quickOrder.buyProps}
        >
          {renderProductItemContent()}
        </SearchProductItemControl>
      )}
    </section>
  )
}
