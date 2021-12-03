import React, { forwardRef } from 'react'
import type { HTMLAttributes, AriaAttributes } from 'react'

export interface ProductCardTitleProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  'aria-label'?: AriaAttributes['aria-label']
}

const ProductCardTitle = forwardRef<HTMLDivElement, ProductCardTitleProps>(
  function ProductCardTitle(
    {
      testId = 'store-product-card-title',
      'aria-label': ariaLabel = 'Product title',
      children,
      ...otherProps
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        aria-label={ariaLabel}
        data-store-product-card-title
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </div>
    )
  }
)

export default ProductCardTitle
