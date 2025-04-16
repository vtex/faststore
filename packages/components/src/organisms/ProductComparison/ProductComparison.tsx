import React, { forwardRef, type HTMLAttributes } from 'react'
import ProductComparisonProvider from './provider/ProductComparisonProvider'

export interface ProductComparisonProps extends HTMLAttributes<HTMLDivElement> {
  /*
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const ProductComparison = forwardRef<HTMLDivElement, ProductComparisonProps>(
  function ProductComparison(
    { testId = 'fs-product-comparison', children, ...otherProps },
    ref
  ) {
    return (
      <div ref={ref} data-testid={testId} {...otherProps}>
        <ProductComparisonProvider>{children}</ProductComparisonProvider>
      </div>
    )
  }
)

export default ProductComparison
