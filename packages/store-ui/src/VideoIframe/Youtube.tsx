import React, { FC, HTMLProps } from 'react'
import { Box } from 'theme-ui'

interface Props extends HTMLProps<HTMLIFrameElement> {
  variant?: string
  autoplay?: boolean
  loop?: boolean
  title: string
  src: string
}

const extractVideoID = (url: string) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)

  if (match && match[7].length === 11) {
    return match[7]
  }

  return null
}

const getIframeSrc = ({ loop, autoplay, title, src }: Props) => {
  const params = `autoplay=${autoplay}&loop=${loop}&title=${title}&enablejsapi=1&iv_load_policy=3&modestbranding=1`
  const videoId = extractVideoID(src)

  return `https://www.youtube.com/embed/${videoId}?${params}`
}

const Youtube: FC<Props> = (props) => {
  const iframeSrc = getIframeSrc(props)

  const iframeProps: HTMLProps<HTMLIFrameElement> = {
    ...props,
    src: iframeSrc,
    frameBorder: 0,
    allowFullScreen: true,
  }

  return <Box {...iframeProps} as="iframe" />
}

export default Youtube
