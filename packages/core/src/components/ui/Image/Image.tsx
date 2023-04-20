import { memo } from 'react'

import NextImage, { ImageProps } from 'next/future/image'
import loader from './loader'

// Next loader function does not handle all props as height and options
// so we use a custom loader to handle images using thumbor server with VTEX CDN
// https://nextjs.org/docs/api-reference/next/image#loader
function Image({ src, width, height, alt, ...otherProps }: ImageProps) {
  return (
    <NextImage
      data-fs-image
      loader={loader}
      src={src}
      width={width}
      height={height}
      alt={alt}
      {...otherProps}
    />
  )
}

Image.displayName = 'Image'
export default memo(Image)
