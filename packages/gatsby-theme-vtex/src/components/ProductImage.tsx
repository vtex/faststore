import { Image } from '@vtex/gatsby-source-vtex'
import React, { FC } from 'react'

import { IMAGE_DEFAULT, scaleImage } from '../utils/img'

interface Props {
  width: number
  height: number
  src: Image['imageUrl']
  alt: Image['imageText']
  loading?: 'lazy' | 'eager'
}

// TODO: ratio?
const ProductImage: FC<Props> = ({
  width = 300,
  height = 300,
  src = IMAGE_DEFAULT,
  alt = 'Product Image',
  loading = 'lazy',
}) => (
  <img
    loading={loading}
    src={scaleImage(src, width, height)}
    alt={alt}
    style={{
      objectFit: 'cover',
      maxWidth: '100%',
    }}
    width={`${width}px`}
    height={`${height}px`}
  />
)

export default ProductImage
