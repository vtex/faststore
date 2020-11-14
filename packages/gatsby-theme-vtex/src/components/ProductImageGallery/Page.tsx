import React, { ComponentPropsWithoutRef, FC } from 'react'
import { AspectImage, ProgressiveImage, YoutubeIframe } from '@vtex/store-ui'

export type Item =
  | {
      type: 'video'
      props: ComponentPropsWithoutRef<typeof YoutubeIframe>
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
      variant={`${variant}.media`}
      ratio={1}
      as={AspectImage}
    />
  ) : (
    <YoutubeIframe {...item.props} variant={`${variant}.media`} />
  )

export default ProductImageGalleryPage
