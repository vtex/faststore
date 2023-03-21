import { useState } from 'react'
import {
  ImageGallery as UIImageGallery,
  ImageElementData,
  ImageZoom,
  ImageGallerySelector,
} from '@faststore/ui'

import { Image } from 'src/components/ui/Image'

const ImageComponent = ({ url, alternateName }) => (
  <Image
    // onLoadingComplete={(img) => {
    //   if (ref) ref(img)
    // }}
    src={url}
    alt={alternateName}
    // loading={idx === 0 ? 'eager' : 'lazy'}
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

  const hasSelector = images.length > 1

  return (
    <UIImageGallery images={images} {...otherProps}>
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
      {hasSelector && (
        <ImageGallerySelector
          images={images}
          onSelect={setSelectedImageIdx}
          currentImageIdx={selectedImageIdx}
          ImageComponent={ImageComponent}
        />
      )}
    </UIImageGallery>
  )
}

export default ImageGallery
