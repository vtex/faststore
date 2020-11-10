import React, { FC } from 'react'
import { AspectRatio } from 'theme-ui'

import YouTube, { Props as YoutubeProps } from './Youtube'

const Video: FC<YoutubeProps> = (props) => {
  const innerVariant = `${props.variant}.video`

  return (
    <AspectRatio ratio={1} sx={{ paddingTop: '20%' }}>
      <AspectRatio ratio={4 / 3}>
        <YouTube
          {...props}
          sx={{ width: '100%', height: '100%' }}
          variant={innerVariant}
        />
      </AspectRatio>
    </AspectRatio>
  )
}

export default Video
