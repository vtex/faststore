import { useState } from 'react'

import { Image } from 'src/components/ui/Image'
import styles from 'src/components/ui/ImageGallery/image-gallery.module.scss'

import { ImageGallerySelector, ImageZoom } from '.'

export interface ImageElementData {
  url: string
  alternateName: string
}

interface ImageGalleryProps {
  images: ImageElementData[]
}

function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const currentImage = images[selectedImageIdx]

  return (
    <section data-fs-image-gallery className={styles['fs-image-gallery']}>
      <ImageZoom>
        <Image
          src={currentImage.url}
          alt={currentImage.alternateName}
          sizes="(max-width: 804px) 25vw, 30vw"
          width={804}
          height={804 * (3 / 4)}
          loading="eager"
        />
      </ImageZoom>
      {images.length > 1 && (
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
