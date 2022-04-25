import type { HTMLAttributes } from 'react'
import { forwardRef } from 'react'

export interface HeroLinkProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const HeroLink = forwardRef<HTMLDivElement, HeroLinkProps>(function HeroLink(
  { testId = 'hero-link', children, ...otherProps },
  ref
) {
  return (
    <div ref={ref} data-hero-link data-testid={testId} {...otherProps}>
      {children}
    </div>
  )
})

export default HeroLink
