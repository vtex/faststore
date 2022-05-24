import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface HeroHeadingProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const HeroHeading = forwardRef<HTMLDivElement, HeroHeadingProps>(
  function BannerContent(
    { testId = 'store-hero-heading', children, ...otherProps },
    ref
  ) {
    return (
      <header ref={ref} data-hero-heading data-testid={testId} {...otherProps}>
        {children}
      </header>
    )
  }
)

export default HeroHeading
