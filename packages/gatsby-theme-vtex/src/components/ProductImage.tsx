import { Image } from '@vtex/gatsby-source-vtex'
import { ProgressiveImage } from '@vtex/store-ui'
import React, { FC } from 'react'
import { AspectImage } from 'theme-ui'

import { IMAGE_DEFAULT, scaleImage } from '../utils/img'

interface Props {
  width: number
  height: number
  src: Image['imageUrl']
  alt: Image['imageText']
  loading?: 'lazy' | 'eager'
}

const SIZE = 96

const ProductImage: FC<Props> = ({
  width = SIZE,
  height = SIZE,
  src = IMAGE_DEFAULT,
  alt = 'Product Image',
  loading = 'lazy',
}) => (
  <ProgressiveImage
    as={AspectImage}
    placeholder={scaleImage(src, SIZE, SIZE)}
    src={scaleImage(src, width, height)}
    ratio={1}
    loading={loading}
    alt={alt}
    width={`${width}px`}
    height={`${height}px`}
  />
)

export default ProductImage
