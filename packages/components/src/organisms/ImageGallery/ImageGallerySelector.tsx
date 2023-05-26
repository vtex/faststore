import React, { useRef, useState, useCallback } from 'react'
import type { AriaAttributes } from 'react'
import { InView } from 'react-intersection-observer'
import { Button, Icon, IconButton } from '../..'

import type { ImageGalleryProps } from '.'

export interface ImageGallerySelectorProps
  extends Pick<ImageGalleryProps, 'images' | 'ImageComponent'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * The currently active thumbnail.
   */
  currentImageIdx: number
  /**
   * For accessibility purposes, define a string that labels the current element.
   */
  'aria-label'?: AriaAttributes['aria-label']
  /**
   * For accessibility purposes, define a string that labels the left navigation icon button.
   */
  navigationButtonLeftAriaLabel?: AriaAttributes['aria-label']
  /**
   * For accessibility purposes, define a string that labels the right navigation button icon.
   */
  navigationButtonRightAriaLabel?: AriaAttributes['aria-label']
  /**
   * Event handler for clicks on each thumbnail.
   */
  onSelect: (imageIdx: number) => void
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
  currentImageIdx,
  testId = 'fs-image-gallery-selector',
  'aria-label': ariaLabel = 'Product Images',
  navigationButtonLeftAriaLabel = 'Backward slide image selector',
  navigationButtonRightAriaLabel = 'Forward slide image selector',
}: ImageGallerySelectorProps) {
  const elementsRef = useRef<HTMLDivElement>(null)
  const elementHasScroll = hasScroll(elementsRef.current)
  const [firstImageInView, setFirstImageInView] = useState(true)
  const [lastImageInView, setLastImageInView] = useState(true)

  const inViewChange = useCallback(
    (idx: number, inView: boolean) => {
      idx === 0 && setFirstImageInView(inView)
      idx === images.length - 1 && setLastImageInView(inView)
    },
    [images.length]
  )

  return (
    <section
      data-fs-image-gallery-selector
      data-testid={testId}
      aria-label={ariaLabel}
    >
      {elementHasScroll && !firstImageInView && (
        <div data-fs-image-gallery-selector-control>
          <IconButton
            data-fs-image-gallery-selector-control-button
            aria-label={navigationButtonLeftAriaLabel}
            icon={<Icon name="ArrowLeft" />}
            onClick={() =>
              moveScroll(elementsRef.current, -SCROLL_MARGIN_VALUE)
            }
          />
        </div>
      )}
      <div data-fs-image-gallery-selector-elements ref={elementsRef}>
        {images.map((image, idx) => {
          return (
            <InView key={idx} onChange={(inView) => inViewChange(idx, inView)}>
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
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  alternateName={image.alternateName ?? ''}
                />
              </Button>
            </InView>
          )
        })}
      </div>
      {elementHasScroll && !lastImageInView && (
        <div data-fs-image-gallery-selector-control>
          <IconButton
            data-fs-image-gallery-selector-control-button
            aria-label={navigationButtonRightAriaLabel}
            icon={<Icon name="ArrowLeft" />}
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
