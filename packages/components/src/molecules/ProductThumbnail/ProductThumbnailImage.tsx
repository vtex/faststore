import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface ProductThumbnailImageProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Specifies the ProductThumbnail image's aspect ratio.
   */
  aspectRatio?: number
}

const ProductThumbnailImage = forwardRef<
  HTMLDivElement,
  ProductThumbnailImageProps
>(function ProductThumbnailImage(
  {
    testId = 'fs-product-thumbnail-image',
    aspectRatio = 1,
    children,
    ...otherProps
  },
  ref
) {
  return (
    <div
      ref={ref}
      data-fs-product-thumbnail-image
      data-testid={testId}
      style={
        {
          '--fs-product-thumbnail-image-aspect-ratio': aspectRatio,
        } as React.CSSProperties
      }
      {...otherProps}
    >
      {children}
    </div>
  )
})

export default ProductThumbnailImage
