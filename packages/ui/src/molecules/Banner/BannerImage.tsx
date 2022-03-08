import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface BannerImageProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const BannerImage = forwardRef<HTMLDivElement, BannerImageProps>(
  function BannerImage(
    { testId = 'store-banner-image', children, ...otherProps },
    ref
  ) {
    return (
      <div ref={ref} data-banner-image data-testid={testId} {...otherProps}>
        {children}
      </div>
    )
  }
)

export default BannerImage
