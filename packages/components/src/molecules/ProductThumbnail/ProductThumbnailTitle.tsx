import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface ProductThumbnailTitleProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Specifies the product's title.
   */
  title: string
}

const ProductThumbnailTitle = forwardRef<
  HTMLDivElement,
  ProductThumbnailTitleProps
>(function ProductThumbnailTitle(
  { testId = 'fs-product-thumbnail-title', title, ...otherProps },
  ref
) {
  return (
    <h3
      ref={ref}
      data-fs-product-thumbnail-title
      data-testid={testId}
      {...otherProps}
    >
      {title}
    </h3>
  )
})

export default ProductThumbnailTitle
