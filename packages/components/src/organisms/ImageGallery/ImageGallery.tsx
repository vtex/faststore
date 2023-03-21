import type { HTMLAttributes } from 'react'
import React, { ReactNode } from 'react'

export interface ImageElementData {
  src: string
  alternateName: string
  /**
   * Function to define what image should be used.
   */
  renderImage?: (src?: string, alternateName?: string) => ReactNode
}

export interface ImageGalleryProps extends HTMLAttributes<HTMLDivElement> {
  images: ImageElementData[]
}

function ImageGallery({ images, children, ...otherProps }: ImageGalleryProps) {
  const hasSelector = images.length > 1

  return (
    <section
      data-fs-image-gallery={hasSelector ? 'with-selector' : 'without-selector'}
      {...otherProps}
    >
      {children}
    </section>
  )
}

export default ImageGallery
