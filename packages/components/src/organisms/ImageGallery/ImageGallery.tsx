import React, { forwardRef } from 'react'
import type { HTMLAttributes, FunctionComponent } from 'react'

import { ImageGallerySelector } from '../..'

type ImageComponentType = FunctionComponent<{
  url: string
  alternateName?: string
  loading?: 'eager' | 'lazy'
}>

export interface ImageElementData {
  /**
   * Image URL.
   */
  url: string
  /**
   * Alternative text description of the image.
   */
  alternateName: string
}

export interface ImageGalleryProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * List of images that should be rendered.
   */
  images: ImageElementData[]
  /**
   * Function that returns a React component that will be used to render images.
   */
  ImageComponent: ImageComponentType
  /**
   * The currently active thumbnail.
   */
  selectedImageIdx: number
  /**
   * The position of the thumbnail image.
   */
  imagePosition: "top" | "center" | "bottom"
  /**
   * Event handler for clicks on each thumbnail.
   */
  setSelectedImageIdx: (idx: number) => void
}

const ImageGallery = forwardRef<HTMLDivElement, ImageGalleryProps>(
  function ImageGallery(
    {
      images,
      children,
      ImageComponent,
      selectedImageIdx,
      imagePosition,
      setSelectedImageIdx,
      testId = 'fs-image-gallery',
      ...otherProps
    },
    ref
  ) {
    const hasSelector = images.length > 1

    return (
      <section
        ref={ref}
        data-fs-image-gallery={
          hasSelector ? 'with-selector' : 'without-selector'
        }
        data-testid={testId}
        {...otherProps}
      >
        {children}
        {hasSelector && (
          <ImageGallerySelector
            images={images}
            onSelect={setSelectedImageIdx}
            currentImageIdx={selectedImageIdx}
            imagePosition={imagePosition}
            ImageComponent={ImageComponent}
          />
        )}
      </section>
    )
  }
)

export default ImageGallery
