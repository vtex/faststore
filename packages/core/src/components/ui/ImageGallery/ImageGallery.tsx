import { useState } from 'react'
import type { HTMLAttributes } from 'react'

import { Image } from 'src/components/ui/Image'
import styles from 'src/components/ui/ImageGallery/image-gallery.module.scss'

import { ImageGallerySelector, ImageZoom } from '.'

export interface ImageElementData {
  url: string
  alternateName: string
}

interface ImageGalleryProps extends HTMLAttributes<HTMLDivElement> {
  images: ImageElementData[]
}

function ImageGallery({ images, ...otherProps }: ImageGalleryProps) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const currentImage = images[selectedImageIdx]
  const hasSelector = images.length > 1

  return (
    <section
      data-fs-image-gallery={hasSelector ? 'with-selector' : 'without-selector'}
      className={styles.fsImageGallery}
      {...otherProps}
    >
      <ImageZoom>
        <Image
          src={currentImage.url}
          alt={currentImage.alternateName}
          sizes="(max-width: 804px) 25vw, 30vw"
          width={804}
          height={804 * (3 / 4)}
          loading="eager"
          fetchPriority="high"
        />
      </ImageZoom>
      {hasSelector && (
        <ImageGallerySelector
          images={images}
          currentImageIdx={selectedImageIdx}
          onSelect={setSelectedImageIdx}
        />
      )}
    </section>
  )
}

export default ImageGallery
