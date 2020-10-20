import React, { ComponentProps, FC } from 'react'
import { AspectImage } from '@vtex/store-ui'

export type Item = ComponentProps<typeof AspectImage>

interface Props {
  item: Item
}

const ProductImageGalleryPage: FC<Props> = ({ item }) => (
  <AspectImage ratio={1} {...item} />
)

export default ProductImageGalleryPage
