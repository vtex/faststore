import { AspectImage, ProgressiveLoader } from '@vtex/store-ui'
import React, { ComponentProps, FC } from 'react'

export type Item = Omit<ComponentProps<typeof ProgressiveLoader>, 'as'>

interface Props {
  item: Item
  variant: string
}

const ProductImageGalleryPage: FC<Props> = ({ item, variant }) => (
  <ProgressiveLoader {...item} variant={variant} ratio={1} as={AspectImage} />
)

export default ProductImageGalleryPage
