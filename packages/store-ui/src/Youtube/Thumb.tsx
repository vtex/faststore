import React, { ComponentPropsWithoutRef, FC } from 'react'
import { AspectImage } from 'theme-ui'

import { useYoutubeThumbSrc } from './hooks'

type Props = ComponentPropsWithoutRef<typeof AspectImage>

const YoutubeThumb: FC<Props> = ({ src, ...rest }) => {
  const thumbSrc = useYoutubeThumbSrc(src!)

  return <AspectImage {...rest} src={thumbSrc} />
}

export default YoutubeThumb
