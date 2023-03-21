import { Button, IconButton } from '../..'
import React, { useRef } from 'react'
import { useInView } from 'react-intersection-observer'

import type { ImageElementData } from './ImageGallery'

interface Props {
  images: ImageElementData[]
  onSelect: React.Dispatch<React.SetStateAction<number>>
  currentImageIdx: number
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

function ImageGallerySelector({ images, onSelect, currentImageIdx }: Props) {
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
      aria-roledescription="carousel"
      aria-label="Product images"
    >
      {elementHasScroll && !firstImageInView && (
        <IconButton
          data-fs-image-gallery-selector-control-button
          aria-label="backward slide image selector"
          icon={<ArrowLeft />}
          onClick={() => moveScroll(elementsRef.current, -SCROLL_MARGIN_VALUE)}
        />
      )}
      <div data-fs-image-gallery-selector-elements ref={elementsRef}>
        {images.map((image, idx) => {
          const ref =
            idx === 0
              ? firstImageRef
              : idx === images.length - 1
              ? lastImageRef
              : null

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
              {image.renderImage?.(image.src!, image.alternateName)}
            </Button>
          )
        })}
      </div>
      {elementHasScroll && !lastImageInView && (
        <IconButton
          data-fs-image-gallery-selector-control-button
          aria-label="forward slide image selector"
          icon={<ArrowLeft />}
          onClick={() => moveScroll(elementsRef.current, +SCROLL_MARGIN_VALUE)}
        />
      )}
    </section>
  )
}

export default ImageGallerySelector
