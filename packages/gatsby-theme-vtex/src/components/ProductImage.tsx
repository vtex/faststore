import { Image } from '@vtex/gatsby-source-vtex'
import React, { FC } from 'react'
import { AspectImage } from 'theme-ui'

import { IMAGE_DEFAULT, scaleImage } from '../utils/img'

interface Props {
  width: number
  height: number
  product: {
    items: Array<{
      images: Array<{
        imageUrl: Image['imageUrl']
        imageText: Image['imageText']
      }>
    }>
  }
  loading?: 'lazy' | 'eager'
}

const ProductImage: FC<Props> = ({
  width,
  height,
  product,
  loading = 'lazy',
}) => {
  const image = product.items?.[0]?.images?.[0]
  const imageAlt = image ? image.imageText : 'Product Image'
  const imageUrl = image ? scaleImage(image.imageUrl, 300, 300) : IMAGE_DEFAULT

  return (
    <AspectImage
      loading={loading}
      ratio={1}
      src={imageUrl}
      alt={imageAlt}
      width={`${width}px`}
      height={`${height}px`}
    />
  )
}

export default ProductImage
