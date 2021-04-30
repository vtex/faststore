import React from 'react'
import type { ThemeUIStyleObject } from 'theme-ui'
import { AspectRatio, Box } from 'theme-ui'
import type { FC, HTMLProps, Ref } from 'react'

import { useYoutubeEmbeddedSrc } from './hooks'

interface Props extends HTMLProps<HTMLIFrameElement> {
  variant?: string
  autoplay?: boolean
  loop?: boolean
  title: string
  src: string
  ref?: Ref<HTMLIFrameElement>
}

const styles: ThemeUIStyleObject = {
  width: '100%',
  height: '100%',
}

const YoutubeIframe: FC<Props> = (props) => {
  const iframeSrc = useYoutubeEmbeddedSrc(props)

  const iframeProps = {
    ...props,
    src: iframeSrc,
    frameBorder: 0,
    allowFullScreen: true,
  }

  return (
    <AspectRatio ratio={1} sx={{ paddingTop: '20%' }}>
      <AspectRatio ratio={4 / 3}>
        <Box sx={styles} {...iframeProps} as="iframe" />
      </AspectRatio>
    </AspectRatio>
  )
}

export default YoutubeIframe
