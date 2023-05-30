import { ImageElementData } from '@faststore/ui'
import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import {
  Components,
  Props,
} from 'src/components/sections/ProductDetails/Overrides'

const ImageComponent = ({ url, alternateName }) => {
  const { __experimentalImageGalleryImage: Image } = Components

  return <Image src={url} alt={alternateName} width={68} height={68} />
}

export interface ImageGalleryProps {
  images: ImageElementData[]
}

const ImageGallery = ({ images, ...otherProps }: ImageGalleryProps) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const currentImage = images[selectedImageIdx] ?? images[0]
  const dynamicRoute = useRouter().asPath

  useEffect(() => setSelectedImageIdx(0), [dynamicRoute])

  // Deconstructing the object to avoid circular dependency errors
  const {
    ImageGallery: ImageGalleryWrapper,
    ImageZoom,
    __experimentalImageGalleryImage: Image,
  } = Components

  return (
    <ImageGalleryWrapper
      {...Props['ImageGallery']}
      images={images}
      ImageComponent={ImageComponent}
      selectedImageIdx={selectedImageIdx}
      setSelectedImageIdx={setSelectedImageIdx}
      {...otherProps}
    >
      <ImageZoom {...Props['ImageZoom']}>
        <Image
          sizes="(max-width: 360px) 50vw, (max-width: 768px) 90vw, 50vw"
          width={691}
          height={691 * (3 / 4)}
          loading="eager"
          {...Props['__experimentalImageGalleryImage']}
          src={currentImage.url}
          alt={currentImage.alternateName}
        />
      </ImageZoom>
    </ImageGalleryWrapper>
  )
}

export default ImageGallery
