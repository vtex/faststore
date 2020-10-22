import React, { ComponentProps, FC } from 'react'
import { ProgressiveLoader, ResponsiveImage } from '@vtex/store-ui'

export type Item = Omit<ComponentProps<typeof ProgressiveLoader>, 'as'>

interface Props {
  item: Item
  variant: string
}

const ProductImageGalleryPage: FC<Props> = ({ item, variant }) => {
  item.props.variant = variant
  item.propsPlaceholder.variant = variant

  return <ProgressiveLoader {...item} as={ResponsiveImage as any} />
}

export default ProductImageGalleryPage
