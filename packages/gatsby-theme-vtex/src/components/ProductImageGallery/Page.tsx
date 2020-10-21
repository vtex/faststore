import React, { ComponentProps, FC } from 'react'
import { Image, ProgressiveImage } from '@vtex/store-ui'

export type Item = ComponentProps<typeof ProgressiveImage>

interface Props {
  item: Item
}

const ProductImageGalleryPage: FC<Props> = ({ item }) => (
  <ProgressiveImage as={Image} {...item} />
)

export default ProductImageGalleryPage
