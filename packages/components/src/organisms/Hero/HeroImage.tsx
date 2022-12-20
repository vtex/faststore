import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface HeroImageProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const HeroImage = forwardRef<HTMLDivElement, HeroImageProps>(function HeroImage(
  { children, testId = 'fs-hero-image', ...otherProps },
  ref
) {
  return (
    <div ref={ref} data-fs-hero-image data-testid={testId} {...otherProps}>
      {children}
    </div>
  )
})

export default HeroImage
