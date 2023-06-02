import React, { forwardRef, useContext, createContext } from 'react'
import type { HTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary'
type ColorVariant = 'main' | 'light' | 'accent'

interface BannerContext {
  variant: Variant
  colorVariant: ColorVariant
}

const BannerContext = createContext<BannerContext | undefined>(undefined)

export interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Specifies the component direction variant.
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

const Banner = forwardRef<HTMLDivElement, BannerProps>(function Banner(
  {
    children,
    testId = 'fs-banner',
    variant = 'primary',
    colorVariant = 'main',
    ...otherProps
  },
  ref
) {
  const context = { variant, colorVariant }

  return (
    <BannerContext.Provider value={context}>
      <article
        ref={ref}
        data-fs-banner
        data-fs-banner-variant={variant}
        data-fs-banner-color-variant={colorVariant}
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </article>
    </BannerContext.Provider>
  )
})

export function useBanner() {
  const context = useContext(BannerContext)

  if (context === undefined) {
    throw new Error('Do not use Banner components outside the Banner context.')
  }

  return context
}

export default Banner
