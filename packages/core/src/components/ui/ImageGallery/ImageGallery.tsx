import {
  ImageElementData,
  ImageZoom,
  ImageGallery as UIImageGallery,
} from '@faststore/ui'
import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import { Image } from 'src/components/ui/Image'

const ImageComponent = ({ url, alternateName }) => (
  <Image
    src={url}
    alt={alternateName}
    sizes="(max-width: 72px) 25vw, 30vw"
    width={72}
    height={72}
  />
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
          sizes="(max-width: 804px) 25vw, 30vw"
          width={804}
          height={804 * (3 / 4)}
          loading="eager"
        />
      </ImageZoom>
    </UIImageGallery>
  )
}

export default ImageGallery
