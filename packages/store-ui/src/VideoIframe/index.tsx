import React, { FC } from 'react'
import { Box } from 'theme-ui'

import YouTube, { Props as YoutubeProps } from './Youtube'

const Video: FC<YoutubeProps> = (props) => {
  const innerVariant = `${props.variant}.video`

  return (
    <Box variant={`${innerVariant}.container`}>
      <YouTube {...props} variant={innerVariant} />
    </Box>
  )
}

export default Video
