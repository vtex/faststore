import { Button, IconButton } from '../..'
import React, { useRef } from 'react'
import { useInView } from 'react-intersection-observer'

import type { FunctionComponent } from 'react'

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

export interface ImageGallerySelectorProps {
  /**
   * List of images that should be rendered.
   */
  images: ImageElementData[]
  /**
   * Event handler for clicks on each thumbnail.
   */
  onSelect: React.Dispatch<React.SetStateAction<number>>
  /**
   * The currently active thumbnail.
   */
  currentImageIdx: number
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

const SCROLL_MARGIN_VALUE = 400

const moveScroll = (container: HTMLDivElement | null, value: number) => {
  if (container) {
    if (container.scrollHeight > container.clientHeight) {
      // TODO: Temporary workaround for scroll-behavior with scrollTop – Safari 15.4) https://developer.apple.com/forums/thread/703294
      container.style.overflow = 'auto'
      window.requestAnimationFrame(() =>
        container.scrollTo({ top: value, behavior: 'smooth' })
      )
      setTimeout(() => (container.style.overflow = 'hidden'), 2000)
    } else {
      container.scrollLeft += value
    }
  }
}

const hasScroll = (container: HTMLDivElement | null): boolean => {
  if (container) {
    return (
      container.scrollHeight > container.clientHeight ||
      container.scrollWidth > container.clientWidth
    )
  }

  return false
}

function ImageGallerySelector({
  images,
  onSelect,
  ImageComponent,
  testId = 'fs-image-gallery-selector',
  currentImageIdx,
}: ImageGallerySelectorProps) {
  const elementsRef = useRef<HTMLDivElement>(null)
  const elementHasScroll = hasScroll(elementsRef.current)
  const { ref: firstImageRef, inView: firstImageInView } = useInView({
    threshold: 1,
  })

  const { ref: lastImageRef, inView: lastImageInView } = useInView({
    threshold: 1,
  })

  return (
    <section
      data-fs-image-gallery-selector
      data-testid={testId}
      aria-roledescription="carousel"
      aria-label="Product images"
    >
      {elementHasScroll && !firstImageInView && (
        <div data-fs-image-gallery-selector-control>
          <IconButton
            data-fs-image-gallery-selector-control-button
            aria-label="backward slide image selector"
            icon={<ArrowLeft />}
            onClick={() =>
              moveScroll(elementsRef.current, -SCROLL_MARGIN_VALUE)
            }
          />
        </div>
      )}
      <div data-fs-image-gallery-selector-elements ref={elementsRef}>
        {images.map((image, idx) => {
          // const ref =
          //   idx === 0
          //     ? firstImageRef
          //     : idx === images.length - 1
          //     ? lastImageRef
          //     : null

          return (
            <Button
              key={idx}
              aria-label={`${image.alternateName} - Image ${idx + 1} of ${
                images.length
              }`}
              onClick={() => onSelect(idx)}
              data-fs-image-gallery-selector-thumbnail={
                idx === currentImageIdx ? 'selected' : 'true'
              }
            >
              <ImageComponent
                url={image.url ?? ''}
                alternateName={image.alternateName ?? ''}
              />
            </Button>
          )
        })}
      </div>
      {elementHasScroll && !lastImageInView && (
        <div data-fs-image-gallery-selector-control>
          <IconButton
            data-fs-image-gallery-selector-control-button
            aria-label="forward slide image selector"
            icon={<ArrowLeft />}
            onClick={() =>
              moveScroll(elementsRef.current, +SCROLL_MARGIN_VALUE)
            }
          />
        </div>
      )}
    </section>
  )
}

export default ImageGallerySelector
