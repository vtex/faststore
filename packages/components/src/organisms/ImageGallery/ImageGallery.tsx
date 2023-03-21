import type { HTMLAttributes } from 'react'
import React from 'react'

import type { ImageElementData } from './'

export interface ImageGalleryProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * List of images that should be rendered.
   */
  images: ImageElementData[]
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

function ImageGallery({
  images,
  children,
  testId = 'fs-image-gallery',
  ...otherProps
}: ImageGalleryProps) {
  const hasSelector = images.length > 1

  return (
    <section
      data-fs-image-gallery={hasSelector ? 'with-selector' : 'without-selector'}
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </section>
  )
}

export default ImageGallery
