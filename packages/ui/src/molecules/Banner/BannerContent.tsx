import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface BannerContentProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const BannerContent = forwardRef<HTMLDivElement, BannerContentProps>(
  function BannerContent(
    { testId = 'store-banner-content', children, ...otherProps },
    ref
  ) {
    return (
      <div
        ref={ref}
        data-store-banner-content
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </div>
    )
  }
)

export default BannerContent
