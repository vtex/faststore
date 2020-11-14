import React, { FC, HTMLProps } from 'react'
import { AspectRatio, Box } from 'theme-ui'

import { useYoutubeEmbeddedSrc } from './hooks'

interface Props extends HTMLProps<HTMLIFrameElement> {
  variant?: string
  autoplay?: boolean
  loop?: boolean
  title: string
  src: string
}

const YoutubeIframe: FC<Props> = (props) => {
  const iframeSrc = useYoutubeEmbeddedSrc(props)
  const innerVariant = `${props.variant}.video`

  const iframeProps: HTMLProps<HTMLIFrameElement> = {
    ...props,
    src: iframeSrc,
    frameBorder: 0,
    allowFullScreen: true,
  }

  return (
    <AspectRatio ratio={1} sx={{ paddingTop: '20%' }}>
      <AspectRatio ratio={4 / 3}>
        <Box
          variant={innerVariant}
          sx={{ width: '100%', height: '100%' }}
          {...iframeProps}
          as="iframe"
        />
      </AspectRatio>
    </AspectRatio>
  )
}

export default YoutubeIframe
