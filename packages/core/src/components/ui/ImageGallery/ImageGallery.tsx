import { useState } from 'react'
import {
  ImageGallery as UIImageGallery,
  ImageElementData,
  ImageZoom,
} from '@faststore/ui'

import { Image } from 'src/components/ui/Image'

const ImageComponent = ({ url, alternateName, onLoad }) => (
  <Image
    onLoadingComplete={onLoad as any}
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
  const currentImage = images[selectedImageIdx]

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
          priority
        />
      </ImageZoom>
    </UIImageGallery>
  )
}

export default ImageGallery
