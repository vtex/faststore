import React, { useContext, createContext } from 'react'
import type { ComponentProps } from 'react'

type Variant = 'primary' | 'secondary'
type ColorVariant = 'main' | 'light' | 'accent'

interface BannerTextContext {
  variant: Variant
  colorVariant: ColorVariant
}

const BannerTextContext = createContext<BannerTextContext | undefined>(
  undefined
)

export interface BannerTextProps extends ComponentProps<'div'> {
  /**
   * Specifies the component direction variant.
   */
  variant?: Variant
  /**
   * Specifies the component's color variant combination.
   */
  colorVariant?: ColorVariant
  /**
   * ID to find this component in testing tools (e.g.: testing-library, and jest).
   */
  testId?: string
}

export default function BannerText({
  children,
  testId = 'fs-banner-text',
  variant = 'primary',
  colorVariant = 'main',
  ref,
  ...otherProps
}: BannerTextProps) {
  const context = { variant, colorVariant }

  return (
    <BannerTextContext.Provider value={context}>
      <article
        ref={ref}
        data-fs-banner-text
        data-fs-content="banner-text"
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

export function useBannerText() {
  const context = useContext(BannerTextContext)

  if (context === undefined) {
    throw new Error(
      'Do not use BannerText components outside the BannerText context.'
    )
  }

  return context
}
