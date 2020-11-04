import { AspectImage, ProgressiveImage } from '@vtex/store-ui'
import React, { ComponentPropsWithoutRef, FC, HTMLProps } from 'react'

export type Item =
  | {
      type: 'video'
      props: HTMLProps<HTMLIFrameElement>
    }
  | {
      type: 'image'
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
