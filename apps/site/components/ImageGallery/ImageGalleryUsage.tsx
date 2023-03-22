import React, { useState } from 'react'
import { ImageGallery, ImageZoom } from '@faststore/ui'

const ImageComponent = ({ url, alternateName, onLoad }) => (
  <img data-fs-image onLoad={onLoad} src={url} alt={alternateName} />
)

export type ImageGalleryUsageProps = {
  images?: []
}

const ImageGalleryUsage = ({ images }: ImageGalleryUsageProps) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const currentImage = images[selectedImageIdx]

  return (
    <ImageGallery
      images={images}
      ImageComponent={ImageComponent}
      selectedImageIdx={selectedImageIdx}
      setSelectedImageIdx={setSelectedImageIdx}
    >
      <ImageZoom>
        <img
          data-fs-image
          src={currentImage.url}
          alt={currentImage.alternateName}
        />
      </ImageZoom>
    </ImageGallery>
  )
}

export default ImageGalleryUsage
