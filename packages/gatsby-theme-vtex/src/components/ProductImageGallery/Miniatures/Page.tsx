import React, { FC } from 'react'
import { AspectImage, YoutubeThumb } from '@vtex/store-ui'

import { Item } from '../Page'

interface Props {
  item: Item
  variant: string
}

const Page: FC<Props> = ({ item, variant }) => {
  if (item.type === 'image') {
    return <AspectImage {...item.props} {...item.props.targetProps} />
  }

  return <YoutubeThumb src={item.props.src} variant={variant} />
}

export default Page
