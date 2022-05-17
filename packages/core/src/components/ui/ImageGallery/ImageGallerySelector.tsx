import { useRef } from 'react'
import { Button, IconButton } from '@faststore/ui'

import Icon from 'src/components/ui/Icon'
import { Image } from 'src/components/ui/Image'
import styles from 'src/components/ui/ImageGallery/image-gallery-selector.module.scss'

import type { ImageElementData } from './ImageGallery'

interface Props {
  images: ImageElementData[]
  onSelect: React.Dispatch<React.SetStateAction<number>>
  currentImageIdx: number
}

const moveScroll = (container: HTMLDivElement | null, value: number) => {
  if (container) {
    if (container.scrollHeight > container.clientHeight) {
      container.scrollTop += value
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

  return (
    <section
      data-fs-image-gallery-selector
      className={styles.fsImageGallerySelector}
      aria-roledescription="carousel"
      aria-label="Product images"
    >
      {hasScroll(elementsRef.current) && (
        <IconButton
          aria-label="backward slide image selector"
          icon={<Icon name="ArrowLeft" width={24} height={24} />}
          onClick={() => moveScroll(elementsRef.current, -200)}
        />
      )}
      <div data-fs-image-gallery-selector-elements ref={elementsRef}>
        {images.map((image, idx) => {
          return (
            <Button
              key={idx}
              data-thumbnail-button={
                idx === currentImageIdx ? 'selected' : 'true'
              }
              aria-label={`${image.alternateName} - Image ${idx + 1} of ${
                images.length
              }`}
              onClick={() => onSelect(idx)}
            >
              <Image
                src={image.url}
                alt={image.alternateName}
                loading={idx === 0 ? 'eager' : 'lazy'}
                sizes="(max-width: 72px) 25vw, 30vw"
                width={72}
                height={72}
              />
            </Button>
          )
        })}
      </div>
      {hasScroll(elementsRef.current) && (
        <IconButton
          aria-label="forward slide image selector"
          icon={<Icon name="ArrowLeft" width={24} height={24} />}
          onClick={() => moveScroll(elementsRef.current, +200)}
        />
      )}
    </section>
  )
}

export default ImageGallerySelector
