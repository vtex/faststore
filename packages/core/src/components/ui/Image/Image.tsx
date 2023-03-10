import { memo } from 'react'

import NextImage, { ImageProps } from 'next/future/image'
import { ThumborOptions } from './thumborUrlBuilder'
import { useImage } from './useImage'

// Next loader function does not handle all props as height and options,
// so we use the useImage hook to handle the custom thumbor loader with VTEX CDN
// https://nextjs.org/docs/api-reference/next/image#loader
function Image({ src, width, height, quality, ...otherProps }: ImageProps) {
  const { src: thumborSrc, alt } = useImage({
    src: String(src),
    width: Number(width),
    height: Number(height),
    options: quality ? ({ filters: { quality } } as ThumborOptions) : undefined,
    ...otherProps,
  })

  return (
    <NextImage
      data-fs-image
      unoptimized
      loader={() => thumborSrc}
      src={thumborSrc}
      width={width}
      height={height}
      alt={alt}
      {...otherProps}
    />
  )
}

Image.displayName = 'Image'
export default memo(Image)
