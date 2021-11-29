import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface BannerDescriptionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  children: React.ReactNode
}

const BannerDescription = forwardRef<HTMLDivElement, BannerDescriptionProps>(
  function BannerDescription(
    { testId = 'store-banner-description', children, ...otherProps },
    ref
  ) {
    return (
      <div
        ref={ref}
        data-store-banner-description
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </div>
    )
  }
)

export default BannerDescription
