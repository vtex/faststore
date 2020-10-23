import { AspectImage, ProgressiveImage } from '@vtex/store-ui'
import React, { ComponentPropsWithoutRef, FC } from 'react'

export type Item = ComponentPropsWithoutRef<typeof ProgressiveImage>

interface Props {
  item: Item
  variant: string
}

const ProductImageGalleryPage: FC<Props> = ({ item, variant }) => (
  <ProgressiveImage
    {...item}
    variant={`${variant}.img`}
    ratio={1}
    as={AspectImage}
  />
)

export default ProductImageGalleryPage
