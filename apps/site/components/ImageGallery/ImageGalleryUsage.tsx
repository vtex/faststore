import React, { useState } from 'react'
import { ImageGallery, ImageZoom, ImageGallerySelector } from '@faststore/ui'
// import { useInView } from 'react-intersection-observer'

const renderImageFunction = (src: string, alternateName: string) => (
  <img data-fs-image src={src} alt={alternateName} />
)

export const images = [
  {
    src: 'https://storeframework.vtexassets.com/arquivos/ids/190902/unsplash-magic-mouse.jpg?v=637800136963870000',
    alternateName: 'Magicwhite',
    renderImage: renderImageFunction,
  },
  {
    src: 'https://storeframework.vtexassets.com/arquivos/ids/190923/lena-de-fanti-nQ_j5d-klVU-unsplash.jpg?v=637867501523500000',
    alternateName: 'magicbox',
    renderImage: renderImageFunction,
  },
  {
    src: 'https://storeframework.vtexassets.com/arquivos/ids/190924/anthony-choren-e7dG26YCrZU-unsplash.jpg?v=637867501835430000',
    alternateName: 'magicblackwhite',
    renderImage: renderImageFunction,
  },
  {
    src: 'https://storeframework.vtexassets.com/arquivos/ids/190925/maheshkumar-painam-GZdfLeL-MDk-unsplash.jpg?v=637867502064000000',
    alternateName: 'magiccombo',
    renderImage: renderImageFunction,
  },
  {
    src: 'https://storeframework.vtexassets.com/arquivos/ids/190926/math-0U9fBLGP3EY-unsplash.jpg?v=637867502325830000',
    alternateName: 'magicback',
    renderImage: renderImageFunction,
  },
  {
    src: 'https://storeframework.vtexassets.com/arquivos/ids/190927/marek-levak-YPeqMN_wfw0-unsplash.jpg?v=637867502641430000',
    alternateName: 'magictable',
    renderImage: renderImageFunction,
  },
  {
    src: 'https://storeframework.vtexassets.com/arquivos/ids/190928/mouse8.jpg?v=637867504048970000',
    alternateName: 'magichand',
    renderImage: renderImageFunction,
  },
  {
    src: 'https://storeframework.vtexassets.com/arquivos/ids/190929/harpal-singh-KuvEVL7lXYQ-unsplash.jpg?v=637867509459130000',
    alternateName: 'magicstyle',
    renderImage: renderImageFunction,
  },
  {
    src: 'https://storeframework.vtexassets.com/arquivos/ids/190930/chris-hardy-182PzOtcmWc-unsplash.jpg?v=637867509778300000',
    alternateName: 'magicscale',
    renderImage: renderImageFunction,
  },
]

const ImageGalleryUsage = () => {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const currentImage = images[selectedImageIdx]

  const hasSelector = images.length > 1

  return (
    <ImageGallery images={images}>
      <ImageZoom>
        <img
          data-fs-image
          src={currentImage.src}
          alt={currentImage.alternateName}
        />
      </ImageZoom>
      {hasSelector && (
        <ImageGallerySelector
          images={images}
          onSelect={setSelectedImageIdx}
          currentImageIdx={selectedImageIdx}
        />
      )}
    </ImageGallery>
  )
}

export default ImageGalleryUsage
