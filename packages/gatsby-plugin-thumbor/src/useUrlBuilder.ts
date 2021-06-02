import { useCallback } from 'react'
import type { IUrlBuilderArgs } from 'gatsby-plugin-image'

import { urlBuilder as thumborUrlBuilder } from './utils/urlBuilder'
import { useContext } from './Provider'
import type { ThumborProps } from './utils/urlBuilder'

type Options = IUrlBuilderArgs<
  Omit<ThumborProps, 'server' | 'redirectBasePath'>
>

export const useUrlBuilder = () => {
  const { server, redirectBasePath } = useContext()

  const urlBuilder = useCallback(
    (options: Options) =>
      thumborUrlBuilder({
        ...options,
        options: {
          ...options.options,
          server,
          redirectBasePath,
        },
      }),
    [server, redirectBasePath]
  )

  return urlBuilder
}
