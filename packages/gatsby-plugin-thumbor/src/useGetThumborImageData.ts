import { useCallback } from 'react'

import { useContext } from './Provider'
import { getThumborImageData } from './utils/getImageData'
import type { ThumborImageDataOptions } from './utils/getImageData'

export const useGetThumborImageData = () => {
  const { server, redirectBasePath } = useContext()

  const getImageData = useCallback(
    (options: ThumborImageDataOptions) =>
      getThumborImageData({
        ...options,
        options: {
          ...options.options,
          server,
          redirectBasePath,
        },
      }),
    [server, redirectBasePath]
  )

  return getImageData
}
