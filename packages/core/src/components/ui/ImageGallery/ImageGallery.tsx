import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import {
  ImageGallery as ImageGalleryWrapper,
  ImageGalleryViewer,
  __experimentalImageGalleryImage as Image,
} from 'src/components/sections/ProductDetails/Overrides'

import type { ImageGalleryProps as UIImageGalleryProps } from '@faststore/ui'

const ImageComponent = ({ url, alternateName }) => {
  return (
    <Image.Component src={url} alt={alternateName} width={68} height={68} />
  )
}

export interface ImageGalleryProps {
  images: UIImageGalleryProps['images']
  imagePosition?: UIImageGalleryProps['imagePosition']
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
      imagePosition={imagePosition ?? ImageGalleryWrapper.props.imagePosition}
      {...otherProps}
    >
      <ImageGalleryViewer.Component {...ImageGalleryViewer.props}>
        <Image.Component
          sizes="(max-width: 360px) 50vw, (max-width: 768px) 90vw, 50vw"
          width={691}
          height={691 * (3 / 4)}
          loading="eager"
          {...Image.props}
          src={currentImage.url}
          alt={currentImage.alternateName}
        />
      </ImageGalleryViewer.Component>
    </ImageGalleryWrapper.Component>
  )
}

export default ImageGallery
