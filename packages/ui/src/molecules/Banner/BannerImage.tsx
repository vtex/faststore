import type { ImgHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface BannerImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  src: string
  alt: string
}

const BannerImage = forwardRef<HTMLImageElement, BannerImageProps>(
  function BannerImage(
    { testId = 'store-banner-image', src, alt, ...otherProps },
    ref
  ) {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        data-store-banner-image
        data-testid={testId}
        {...otherProps}
      />
    )
  }
)

export default BannerImage
