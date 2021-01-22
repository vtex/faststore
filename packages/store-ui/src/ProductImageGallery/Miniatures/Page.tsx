import { AspectImage } from 'theme-ui'
import React from 'react'
import type { FC } from 'react'

import { YoutubeThumb } from '../../index'
import type { Item } from '../Page'

interface Props {
  item: Item
  variant: string
}

const Page: FC<Props> = ({ item, variant }) =>
  item.type === 'image' ? (
    <AspectImage ratio={1} {...item.props} {...item.props.targetProps} />
  ) : (
    // TODO: Figure out a way of supporting other platforms, like vimeo
    <YoutubeThumb src={item.props.src} variant={variant} />
  )

export default Page
