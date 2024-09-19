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
      data-fs-image
      loader={loader}
      loading={loading}
      priority={loading === 'eager'}
      onLoadingComplete={(image) => {
        // NextImage does not directly forward the ref to the <img /> element, so we need to do that manually.
        if (ref && typeof ref === 'object' && ref.current) {
          ref.current = image
        }
      }}
      {...otherProps}
    />
  )
})

Image.displayName = 'Image'
export default memo(Image)
