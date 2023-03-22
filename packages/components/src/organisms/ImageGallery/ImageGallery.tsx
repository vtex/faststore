import type { HTMLAttributes, FunctionComponent } from 'react'
import React, { useState } from 'react'

import type { ImageElementData } from './'

import { ImageGallerySelector } from '../..'

export interface ImageGalleryProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * List of images that should be rendered.
   */
  images: ImageElementData[]
  /**
   * Function that returns a React component that will be used to render images.
   */
  ImageComponent: FunctionComponent<{
    url: string
    alternateName?: string
  }>
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

function ImageGallery({
  images,
  children,
  ImageComponent,
  testId = 'fs-image-gallery',
  ...otherProps
}: ImageGalleryProps) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const hasSelector = images.length > 1

  return (
    <section
      data-fs-image-gallery={hasSelector ? 'with-selector' : 'without-selector'}
      data-testid={testId}
      {...otherProps}
    >
      {children}
      {hasSelector && (
        <ImageGallerySelector
          images={images}
          onSelect={setSelectedImageIdx}
          currentImageIdx={selectedImageIdx}
          ImageComponent={ImageComponent}
        />
      )}
    </section>
  )
}

export default ImageGallery
