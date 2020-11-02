import { AspectImage, ProgressiveImage } from '@vtex/store-ui'
import React, { ComponentPropsWithoutRef, FC } from 'react'

export type Item =
  | {
      type: 'video'
    }
  | {
      type: 'image'
      src: string
      props: ComponentPropsWithoutRef<typeof ProgressiveImage>
    }

interface Props {
  item: Item
  variant: string
}

const ProductImageGalleryPage: FC<Props> = ({ item, variant }) =>
  item.type === 'image' ? (
    <ProgressiveImage
      {...item.props}
      variant={`${variant}.img`}
      ratio={1}
      as={AspectImage}
    />
  ) : null

export default ProductImageGalleryPage
