import type { ComponentProps } from 'react'
import React from 'react'

export interface HeroImageProps extends ComponentProps<'div'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
}

export default function HeroImage({
  children,
  testId = 'fs-hero-image',
  ref,
  ...otherProps
}: HeroImageProps) {
  return (
    <div ref={ref} data-fs-hero-image data-testid={testId} {...otherProps}>
      {children}
    </div>
  )
}
