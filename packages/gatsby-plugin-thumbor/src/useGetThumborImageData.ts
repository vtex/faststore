import { useCallback } from 'react'

import { useContext } from './Provider'
import { getThumborImageData } from './utils/getImageData'
import type { ThumborImageOptions } from './useThumborImageData'

export const useGetThumborImageData = () => {
  const { server, basePath } = useContext()

  const getImageData = useCallback(
    (options: ThumborImageOptions) =>
      getThumborImageData({
        ...options,
        options: {
          ...options.options,
          server,
          basePath,
        },
      }),
    [server, basePath]
  )

  return getImageData
}
