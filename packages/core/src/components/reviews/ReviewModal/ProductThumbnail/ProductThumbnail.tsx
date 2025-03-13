import React, { forwardRef } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'

import { Image, type ImageProps } from 'src/components/ui/Image'

export interface ProductThumbnailProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * Specifies the ProductThumbnail image's aspect ratio.
   */
  aspectRatio?: number
  /**
   * The title of the Product.
   */
  title: ReactNode
  /**
   * The image of the Product.
   */
  image: ImageProps
}

const ProductThumbnail = forwardRef<HTMLDivElement, ProductThumbnailProps>(
  function ProductThumbnail(
    {
      testId = 'fs-product-thumbnail',
      aspectRatio,
      image,
      title,
      ...otherProps
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        data-testid={testId}
        data-fs-review-modal-product-thumbnail
        {...otherProps}
      >
        <div
          data-fs-review-modal-product-thumbnail-image
          style={
            {
              '--fs-product-thumbnail-image-aspect-ratio': aspectRatio,
            } as React.CSSProperties
          }
          {...otherProps}
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width ?? 50}
            height={image.height ?? 50}
          />
        </div>
        <h3 data-fs-product-thumbnail-title>{title}</h3>
      </div>
    )
  }
)

export default ProductThumbnail
