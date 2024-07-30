import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import type { ImageGalleryProps as UIImageGalleryProps } from '@faststore/ui'
import { useOverrideComponents } from 'app/sdk/overrides/OverrideContext'

const ImageComponent = ({ url, alternateName }) => {
  const { __experimentalImageGalleryImage: Image } =
    useOverrideComponents<'ProductDetails'>()

  return (
    <Image.Component src={url} alt={alternateName} width={68} height={68} />
  )
}

export interface ImageGalleryProps {
  images: UIImageGalleryProps['images']
}

const ImageGallery = ({ images, ...otherProps }: ImageGalleryProps) => {
  const {
    ImageGallery: ImageGalleryWrapper,
    ImageGalleryViewer,
    __experimentalImageGalleryImage: Image,
  } = useOverrideComponents<'ProductDetails'>()

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
