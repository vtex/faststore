import { AspectImage } from 'theme-ui'
import React, { FC } from 'react'

interface Props {
  loading?: 'lazy' | 'eager'
  width: string | number
  height: string | number
  variant: string
  src: string
  alt: string
}

const ProductSummaryImage: FC<Props> = ({
  loading = 'lazy',
  height,
  width,
  variant,
  src,
  alt,
}) => (
  <AspectImage
    variant={`productSummary.${variant}.image`}
    src={src}
    ratio={1}
    loading={loading}
    alt={alt}
    width={width}
    height={height}
  />
)

export default ProductSummaryImage
