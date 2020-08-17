import { Image } from '@vtex/gatsby-source-vtex'
import React, { FC } from 'react'
import { AspectImage } from 'theme-ui'
import ProgressiveImage from 'react-progressive-image'

import { IMAGE_DEFAULT, scaleImage } from '../utils/img'

interface Props {
  width: number
  height: number
  src: Image['imageUrl']
  alt: Image['imageText']
  loading?: 'lazy' | 'eager'
}

const ProductImage: FC<Props> = ({
  width = 300,
  height = 300,
  src = IMAGE_DEFAULT,
  alt = 'Product Image',
  loading = 'lazy',
}) => (
  <ProgressiveImage
    placeholder={scaleImage(src, 300, 300)}
    src={scaleImage(src, width, height)}
  >
    {(imageSrc: string) => (
      <AspectImage
        ratio={1}
        loading={loading}
        src={imageSrc}
        alt={alt}
        width={`${width}px`}
        height={`${height}px`}
      />
    )}
  </ProgressiveImage>
)

export default ProductImage
