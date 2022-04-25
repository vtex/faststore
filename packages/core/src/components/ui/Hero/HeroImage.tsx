import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export interface HeroImageProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const HeroImage = forwardRef<HTMLDivElement, HeroImageProps>(function HeroImage(
  { testId = 'hero-image', children, ...otherProps },
  ref
) {
  return (
    <div ref={ref} data-hero-image data-testid={testId} {...otherProps}>
      {children}
    </div>
  )
})

export default HeroImage
