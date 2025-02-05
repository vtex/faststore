import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface ProductThumbnailProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

const ProductThumbnail = forwardRef<HTMLDivElement, ProductThumbnailProps>(
  function ProductThumbnail(
    { testId = 'fs-product-thumbnail', children, ...otherProps },
    ref
  ) {
    return (
      <div ref={ref} data-testid={testId} {...otherProps}>
        {children}
      </div>
    )
  }
)

export default ProductThumbnail
