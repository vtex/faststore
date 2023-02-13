import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface ProductCardImageProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Specifies the ProductCard image's aspect ratio.
   */
  aspectRatio?: number
}

const ProductCardImage = forwardRef<HTMLDivElement, ProductCardImageProps>(
  function ProductCardImage(
    {
      testId = 'fs-product-card-image',
      aspectRatio = 1,
      children,
      ...otherProps
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        data-fs-product-card-image
        data-testid={testId}
        style={
          {
            '--fs-product-card-image-aspect-ratio': aspectRatio
          } as React.CSSProperties
        }
        {...otherProps}
      >
        {children}
      </div>
    )
  }
)

export default ProductCardImage
