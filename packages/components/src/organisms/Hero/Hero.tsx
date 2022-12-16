import React, { forwardRef, useContext, createContext } from 'react'
import type { HTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary'
type ColorVariant = 'main' | 'light' | 'accent'

interface HeroContext {
  variant: Variant
  colorVariant: ColorVariant
}

const HeroContext = createContext<HeroContext | undefined>(undefined)

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
  const context = { variant, colorVariant }

  return (
    <HeroContext.Provider value={context}>
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
    </HeroContext.Provider>
  )
})

export function useHero() {
  const context = useContext(HeroContext)

  if (context === undefined) {
    throw new Error('Do not use Hero components outside the Hero context.')
  }

  return context
}

export default Hero
