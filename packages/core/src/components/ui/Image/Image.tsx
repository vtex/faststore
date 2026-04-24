import { memo } from 'react'

import NextImage, { type ImageProps as NextImageProps } from 'next/image'
import { faststoreLoader } from './loader'

export type ImageProps = NextImageProps

// FastStore Image component that uses custom loader for VTEX URLs (optimized)
// Returns src directly for all other images (no optimization)
function Image({ loading = 'lazy', ...otherProps }: ImageProps) {
  return (
    <NextImage
      data-fs-image
      loader={faststoreLoader}
      loading={loading}
      priority={loading === 'eager'}
      {...otherProps}
    />
  )
}

Image.displayName = 'Image'
export default memo(Image)
