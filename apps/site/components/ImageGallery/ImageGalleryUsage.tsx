/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import { ImageGallery, ImageGalleryViewer } from '@faststore/ui'
import type { ImageElementData } from '@faststore/components'

const ImageComponent = ({ url, alternateName, onLoad }) => (
  <img data-fs-image src={url} alt={alternateName} onLoad={onLoad} />
)

export interface ImageGalleryUsageProps {
  images?: ImageElementData[]
}

const ImageGalleryUsage = ({
  images,
}: ImageGalleryUsageProps) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const currentImage = images[selectedImageIdx]

  return (
    <ImageGallery
      images={images}
      ImageComponent={ImageComponent}
      selectedImageIdx={selectedImageIdx}
      setSelectedImageIdx={setSelectedImageIdx}
    >
      <ImageGalleryViewer>
        <img
          data-fs-image
          src={currentImage.url}
          alt={currentImage.alternateName}
          style={{ aspectRatio: 15 / 14 }}
        />
      </ImageGalleryViewer>
    </ImageGallery>
  )
}

export default ImageGalleryUsage
