import React, { forwardRef, HTMLAttributes } from 'react'
import ProductComparisonProvider from './provider/ProductComparisonProvider'

export interface ProductComparisonProps extends HTMLAttributes<HTMLDivElement> {
  testId?: string
}

const ProductComparison = forwardRef<HTMLDivElement, ProductComparisonProps>(function ProductComparison(
  { testId = 'fs-product-comparison', children, ...otherProps}, ref){
  return (
    <div ref={ref} data-testId={testId}  {...otherProps}>
      <ProductComparisonProvider>
        {children}
      </ProductComparisonProvider>
    </div>
  )
})

export default ProductComparison
