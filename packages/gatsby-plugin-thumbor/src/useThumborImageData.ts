import { useMemo } from 'react'

import { useContext } from './Provider'
import { getThumborImageData } from './utils/getImageData'
import type { ThumborProps } from './utils/urlBuilder'
import type { ThumborImageDataOptions } from './utils/getImageData'

export interface ThumborImageOptions
  extends Omit<ThumborImageDataOptions, 'options'> {
  options?: Omit<ThumborProps, 'server'>
}

export const useThumborImageData = (options: ThumborImageOptions) => {
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
