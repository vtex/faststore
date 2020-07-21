import { Image } from '@vtex/gatsby-source-vtex'
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

const ProductImage: FC<Props> = ({
  width,
  height,
  src = IMAGE_DEFAULT,
  alt = 'Product Image',
  loading = 'lazy',
}) => (
  <AspectImage
    loading={loading}
    ratio={1}
    src={scaleImage(src, 300, 300)}
    alt={alt}
    width={`${width}px`}
    height={`${height}px`}
  />
)

export default ProductImage
