import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

type Variant = 'primary' | 'secondary'
type ColorVariant = 'main' | 'light' | 'accent'

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

    return (
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
    )
  }
)

export default BannerText
