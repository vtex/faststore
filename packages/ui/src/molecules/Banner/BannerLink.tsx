import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface BannerLinkProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const BannerLink = forwardRef<HTMLDivElement, BannerLinkProps>(
  function BannerLink(
    { testId = 'store-banner-link', children, ...otherProps },
    ref
  ) {
    return (
      <div
        ref={ref}
        data-store-banner-link
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </div>
    )
  }
)

export default BannerLink
