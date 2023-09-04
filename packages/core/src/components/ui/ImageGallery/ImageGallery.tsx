import { ImageElementData } from '@faststore/ui'
import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import {
  ImageGallery as ImageGalleryWrapper,
  ImageZoom,
  __experimentalImageGalleryImage as Image,
} from 'src/components/sections/ProductDetails/Overrides'

const ImageComponent = ({ url, alternateName }) => {
  return (
    <Image.Component src={url} alt={alternateName} width={68} height={68} />
  )
}

export interface ImageGalleryProps {
  images: ImageElementData[]
  imagePosition?: 'top' | 'center' | 'bottom'
}

const ImageGallery = ({
  images,
  imagePosition,
  ...otherProps
}: ImageGalleryProps) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const currentImage = images[selectedImageIdx] ?? images[0]
  const dynamicRoute = useRouter().asPath

  useEffect(() => setSelectedImageIdx(0), [dynamicRoute])

  return (
    <ImageGalleryWrapper.Component
      {...ImageGalleryWrapper.props}
      images={images}
      ImageComponent={ImageComponent}
      selectedImageIdx={selectedImageIdx}
      setSelectedImageIdx={setSelectedImageIdx}
      imagePosition={imagePosition}
      {...otherProps}
    >
      <ImageZoom.Component {...ImageZoom.props}>
        <Image.Component
          sizes="(max-width: 360px) 50vw, (max-width: 768px) 90vw, 50vw"
          width={691}
          height={691 * (3 / 4)}
          loading="eager"
          data-fs-image-gallery-position={imagePosition}
          {...Image.props}
          src={currentImage.url}
          alt={currentImage.alternateName}
        />
      </ImageZoom.Component>
    </ImageGalleryWrapper.Component>
  )
}

export default ImageGallery
