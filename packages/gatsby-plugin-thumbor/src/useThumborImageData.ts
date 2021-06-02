import { useMemo } from 'react'

import { useContext } from './Provider'
import { getThumborImageData } from './utils/getImageData'
import type { ThumborImageDataOptions } from './utils/getImageData'

export const useThumborImageData = (options: ThumborImageDataOptions) => {
  const { server, redirectBasePath } = useContext()

  const image = useMemo(
    () =>
      getThumborImageData({
        ...options,
        options: {
          ...options.options,
          server,
          redirectBasePath,
        },
      }),
    [server, redirectBasePath, options]
  )

  return image
}
