import { useCallback } from 'react'
import type { IUrlBuilderArgs } from 'gatsby-plugin-image'

import { urlBuilder as thumborUrlBuilder } from './utils/urlBuilder'
import { useContext } from './Provider'
import type { ThumborProps } from './utils/urlBuilder'

type Options = IUrlBuilderArgs<Omit<ThumborProps, 'server' | 'basePath'>>

export const useUrlBuilder = () => {
  const { server, basePath } = useContext()

  const urlBuilder = useCallback(
    (options: Options) =>
      thumborUrlBuilder({
        ...options,
        options: {
          ...options.options,
          server,
          basePath,
        },
      }),
    [server, basePath]
  )

  return urlBuilder
}
