import { AspectImage, ProgressiveImage, VideoIframe } from '@vtex/store-ui'
import React, { ComponentPropsWithoutRef, FC } from 'react'

export type Item =
  | {
      type: 'video'
      props: ComponentPropsWithoutRef<typeof VideoIframe>
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
  ) : (
    <VideoIframe
      {...item.props}
      variant={variant}
      url={item.props.src!}
    />
  )

export default ProductImageGalleryPage
