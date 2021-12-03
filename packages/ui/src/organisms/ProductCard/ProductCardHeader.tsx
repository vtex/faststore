import React, { forwardRef } from 'react'
import type { HTMLAttributes, AriaAttributes } from 'react'

export interface ProductCardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  'aria-label'?: AriaAttributes['aria-label']
}

const ProductCardHeader = forwardRef<HTMLDivElement, ProductCardHeaderProps>(
  function ProductCardHeader(
    {
      testId = 'store-product-card-header',
      'aria-label': ariaLabel,
      children,
      ...otherProps
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        aria-label={ariaLabel}
        data-store-product-card-header
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </div>
    )
  }
)

export default ProductCardHeader
