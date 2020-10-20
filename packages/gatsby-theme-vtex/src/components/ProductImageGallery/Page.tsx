import React, { ComponentProps, FC } from 'react'
import { Image } from '@vtex/store-ui'

export type Item = ComponentProps<typeof Image>

interface Props {
  item: Item
}

const ProductImageGalleryPage: FC<Props> = ({ item }) => <Image {...item} />

export default ProductImageGalleryPage
