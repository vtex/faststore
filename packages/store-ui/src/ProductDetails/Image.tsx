import { AspectImage } from 'theme-ui'
import React, { FC } from 'react'

import ProgressiveImage from '../ProgressiveImage/index'

interface Props {
  placeholder: string
  height: number | string
  width: number | string
  src: string
  alt: string
  loading?: 'lazy' | 'eager'
}

const SIZE = '500px'

const ProductDetailsImage: FC<Props> = ({
  width = SIZE,
  height = SIZE,
  loading = 'eager',
  placeholder,
  src,
  alt,
}) => (
  <ProgressiveImage
    as={AspectImage}
    placeholder={placeholder}
    src={src}
    ratio={1}
    loading={loading}
    alt={alt}
    width={width}
    height={height}
  />
)

export default ProductDetailsImage
