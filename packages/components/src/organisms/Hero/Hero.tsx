import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

type Variant = 'primary' | 'secondary'
type ColorVariant = 'main' | 'light' | 'accent'

export interface HeroProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Specifies the component variant.
   */
  variant?: Variant
  /**
   * Specifies the component's color variant combination.
   */
  colorVariant?: ColorVariant
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

const Hero = forwardRef<HTMLDivElement, HeroProps>(function Hero(
  {
    children,
    testId = 'fs-hero',
    variant = 'primary',
    colorVariant = 'main',
    ...otherProps
  },
  ref
) {

  return (
      <article
        ref={ref}
        data-fs-hero
        data-fs-hero-variant={variant}
        data-fs-hero-color-variant={colorVariant}
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </article>
  )
})

export default Hero