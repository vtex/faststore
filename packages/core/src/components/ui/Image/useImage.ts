import type { ImgHTMLAttributes } from 'react'
import { useMemo } from 'react'

import type { ThumborOptions } from './thumborUrlBuilder'
import { urlBuilder } from './thumborUrlBuilder'

export interface ImageOptions extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  width: number
  height: number
  options?: ThumborOptions
  useNewThumborUrl?: boolean
  factor?: 1 | 2 | 3
}

const FACTORS = [1, 2, 3]
const LARGE_FACTOR = FACTORS[FACTORS.length - 1]

export const useImage = ({
  src: baseUrl,
  width,
  height,
  options = {},
  useNewThumborUrl,
  factor = 3,
  ...rest
}: ImageOptions): ImgHTMLAttributes<HTMLImageElement> => {
  const { srcSet, src } = useMemo(() => {
    const builder = urlBuilder(baseUrl, options, useNewThumborUrl)

    const srcs = FACTORS.map((factor) => {
      const rescaledWidth = width * factor

      return `${builder(rescaledWidth, height * factor)} ${rescaledWidth}w`
    })

    return {
      src: builder(width * factor, height * factor),
      srcSet: srcs.join(', '),
    }
  }, [baseUrl, options, useNewThumborUrl, width, factor, height])

  return {
    src,
    srcSet,
    width: `${width}px`,
    height: `${height}px`,
    ...rest,
  }
}
