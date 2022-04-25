import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export interface HeroContentProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const HeroContent = forwardRef<HTMLDivElement, HeroContentProps>(
  function HeroContent(
    { testId = 'hero-content', children, ...otherProps },
    ref
  ) {
    return (
      <section ref={ref} data-hero-content data-testid={testId} {...otherProps}>
        {children}
      </section>
    )
  }
)

export default HeroContent
