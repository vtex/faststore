import { Product } from '@vtex/gatsby-source-vtex'
import React, { FC } from 'react'
import { Styled } from 'theme-ui'

import { IMAGE_DEFAULT, scaleImage } from '../utils/img'

interface Props {
  width?: number | 'auto'
  height?: number | 'auto'
  product: Product
}

const ProductImage: FC<Props> = ({
  width = 'auto',
  height = 'auto',
  product,
}) => {
  const image = product.items?.[0]?.images?.[0]
  const imageUrl = image
    ? scaleImage(image.imageUrl, width, height)
    : IMAGE_DEFAULT
  const imageAlt = image ? image.imageText : 'Product Image'

  return (
    <Styled.img
      width={width === 'auto' ? width : `${width}px`}
      height={height === 'auto' ? height : `${height}px`}
      src={imageUrl}
      alt={imageAlt}
    />
  )
}

export default ProductImage
