import {
  ImageElementData,
  ImageZoom,
  ImageGallery as UIImageGallery,
} from '@faststore/ui'
import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import { Image } from 'src/components/ui/Image'

const ImageComponent = ({ url, alternateName }) => (
  <Image src={url} alt={alternateName} width={68} height={68} />
)

export interface ImageGalleryProps {
  images: ImageElementData[]
}

const ImageGallery = ({ images, ...otherProps }: ImageGalleryProps) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const currentImage = images[selectedImageIdx] ?? images[0]
  const dynamicRoute = useRouter().asPath

  useEffect(() => setSelectedImageIdx(0), [dynamicRoute])

  return (
    <UIImageGallery
      images={images}
      ImageComponent={ImageComponent}
      selectedImageIdx={selectedImageIdx}
      setSelectedImageIdx={setSelectedImageIdx}
      {...otherProps}
    >
      <ImageZoom>
        <Image
          src={currentImage.url}
          alt={currentImage.alternateName}
          sizes="(max-width: 360px) 50vw, (max-width: 768px) 90vw, 50vw"
          width={691}
          height={691 * (3 / 4)}
          loading="eager"
        />
      </ImageZoom>
    </UIImageGallery>
  )
}

export default ImageGallery
