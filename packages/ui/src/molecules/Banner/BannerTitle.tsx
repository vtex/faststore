import React, { forwardRef } from 'react'

export interface BannerTitleProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  children: React.ReactNode
}

const BannerTitle = forwardRef<HTMLDivElement, BannerTitleProps>(
  function BannerTitle(
    { testId = 'store-banner-title', children, ...otherProps },
    ref
  ) {
    return (
      <div
        ref={ref}
        data-store-banner-title
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </div>
    )
  }
)

export default BannerTitle
