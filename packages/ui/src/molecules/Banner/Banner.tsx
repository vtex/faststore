import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

type BannerDirectionVariant = 'vertical' | 'horizontal'
export interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  children: React.ReactNode
  variant?: BannerDirectionVariant
}

const Banner = forwardRef<HTMLDivElement, BannerProps>(function Banner(
  { testId = 'store-banner', children, variant = 'vertical', ...otherProps },
  ref
) {
  return (
    <article
      ref={ref}
      data-store-banner={variant}
      data-testid={testId}
      {...otherProps}
    >
      {children}
    </article>
  )
})

export default Banner
