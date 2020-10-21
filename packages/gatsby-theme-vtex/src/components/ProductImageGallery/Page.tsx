import React, { ComponentProps, FC } from 'react'
import { Image, ProgressiveLoader } from '@vtex/store-ui'

export type Item = Omit<ComponentProps<typeof ProgressiveLoader>, 'as'>

interface Props {
  item: Item
}

const ProductImageGalleryPage: FC<Props> = ({ item }) => (
  <ProgressiveLoader {...item} as={Image} />
)

export default ProductImageGalleryPage
