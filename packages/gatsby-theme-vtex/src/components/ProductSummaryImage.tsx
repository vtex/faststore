/** @jsx jsx */
import { Image } from '@vtex/gatsby-source-vtex'
import { AspectImage, jsx } from '@vtex/store-ui'
import { FC } from 'react'

import { IMAGE_DEFAULT } from '../sdk/img/constants'
import { useScaledImage } from '../sdk/img/useScaledImage'

interface Props {
  width?: number
  height?: number
  src: Image['imageUrl']
  alt: Image['imageText']
  loading?: 'lazy' | 'eager'
}

export const SIZE = 200

const ProductSummaryImage: FC<Props> = ({
  width = SIZE,
  height = SIZE,
  src: rawSrc = IMAGE_DEFAULT,
  alt = 'Product Image',
  loading = 'lazy',
}) => {
  const src = useScaledImage(rawSrc, width, height)

  return (
    <AspectImage
      sx={{ width: '100%' }}
      src={src}
      ratio={1}
      loading={loading}
      alt={alt}
      width={`${width}px`}
      height={`${height}px`}
    />
  )
}

export default ProductSummaryImage
