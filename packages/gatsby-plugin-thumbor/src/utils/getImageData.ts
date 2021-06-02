import { getImageData } from 'gatsby-plugin-image'
import type { IGetImageDataArgs } from 'gatsby-plugin-image'

import { urlBuilder } from './urlBuilder'
import type { ThumborProps } from './urlBuilder'

export type ThumborImageDataOptions = Omit<
  IGetImageDataArgs<ThumborProps>,
  'urlBuilder' | 'pluginName' | 'formats'
>

export const getThumborImageData = (options: ThumborImageDataOptions) =>
  getImageData({
    formats: ['auto'],
    pluginName: 'gatsby-plugin-thumbor',
    urlBuilder,
    ...options,
  })
