/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import { ImageGallery, ImageZoom } from '@faststore/ui'
import type { ImageElementData } from '@faststore/components'

const ImageComponent = ({ url, alternateName, onLoad }) => (
  <img data-fs-image src={url} alt={alternateName} onLoad={onLoad} />
)

export interface ImageGalleryUsageProps {
  images?: ImageElementData[]
  imagePosition?: "top" | "center" | "bottom"
}

const ImageGalleryUsage = ({ images, imagePosition }: ImageGalleryUsageProps) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const currentImage = images[selectedImageIdx]

  return (
    <ImageGallery
      images={images}
      ImageComponent={ImageComponent}
      selectedImageIdx={selectedImageIdx}
      imagePosition={imagePosition}
      setSelectedImageIdx={setSelectedImageIdx}
    >
      <ImageZoom>
        <img
          data-fs-image
          src={currentImage.url}
          alt={currentImage.alternateName}
          style={{ aspectRatio: 15 / 14 }}
        />
      </ImageZoom>
    </ImageGallery>
  )
}

export default ImageGalleryUsage
