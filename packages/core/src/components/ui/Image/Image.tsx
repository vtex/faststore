import { memo, forwardRef } from 'react'
import NextImage, { ImageProps as NextImageProps } from 'next/image'

import loader from './loader'

export type ImageProps = NextImageProps

// Next loader function does not handle all props as height and options
// so we use a custom loader to handle images using thumbor server with VTEX CDN
// https://nextjs.org/docs/api-reference/next/image#loader
const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  { loading = 'lazy', ...otherProps },
  ref
) {
  return (
    <NextImage
      ref={ref}
      data-fs-image
      loader={loader}
      loading={loading}
      priority={loading === 'eager'}
      {...otherProps}
    />
  )
})

Image.displayName = 'Image'
export default memo(Image)
