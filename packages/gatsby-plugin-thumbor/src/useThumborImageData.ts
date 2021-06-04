import { useMemo } from 'react'

import { useContext } from './Provider'
import { getThumborImageData } from './utils/getImageData'
import type { ThumborImageDataOptions } from './utils/getImageData'

export const useThumborImageData = (options: ThumborImageDataOptions) => {
  const { server, basePath } = useContext()

  const image = useMemo(
    () =>
      getThumborImageData({
        ...options,
        options: {
          ...options.options,
          server,
          basePath,
        },
      }),
    [server, basePath, options]
  )

  return image
}
