import React, { forwardRef, useContext, createContext } from 'react'
import type { HTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary'
type ColorVariant = 'main' | 'light' | 'accent'

interface BannerTextContext {
  variant: Variant
  colorVariant: ColorVariant
}

const BannerTextContext = createContext<BannerTextContext | undefined>(
  undefined
)

export interface BannerTextProps extends HTMLAttributes<HTMLDivElement> {
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

const BannerText = forwardRef<HTMLDivElement, BannerTextProps>(
  function BannerText(
    {
      children,
      testId = 'fs-banner-text',
      variant = 'primary',
      colorVariant = 'main',
      ...otherProps
    },
    ref
  ) {
    const context = { variant, colorVariant }

    return (
      <BannerTextContext.Provider value={context}>
        <article
          ref={ref}
          data-fs-banner-text
          data-fs-banner-text-variant={variant}
          data-fs-banner-text-color-variant={colorVariant}
          data-testid={testId}
          {...otherProps}
        >
          {children}
        </article>
      </BannerTextContext.Provider>
    )
  }
)

export function useBannerText() {
  const context = useContext(BannerTextContext)

  if (context === undefined) {
    throw new Error(
      'Do not use BannerText components outside the BannerText context.'
    )
  }

  return context
}

export default BannerText
