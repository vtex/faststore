import { Button } from '@faststore/ui'
import { useState } from 'react'

import { Image } from 'src/components/ui/Image'

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
    <div>
      <ImageZoom>
        <Image
          src={currentImage.url}
          alt={currentImage.alternateName}
          width={250}
          height={250}
        />
      </ImageZoom>
      <ImageGallerySelector itemsPerPage={4}>
        {images.map((image, idx) => {
          return (
            <Button
              key={idx}
              data-thumbnail-button={
                idx === selectedImageIdx ? 'selected' : 'true'
              }
              aria-label={`Load ${image.alternateName} - Image ${idx + 1} of ${
                images.length
              }`}
              onClick={() => {
                setSelectedImageIdx(idx)
              }}
            >
              <Image
                src={image.url}
                alt={image.alternateName}
                loading={idx === 0 ? 'eager' : 'lazy'}
                width={250}
                height={250}
              />
            </Button>
          )
        })}
      </ImageGallerySelector>
    </div>
  )
}

export default ImageGallery
