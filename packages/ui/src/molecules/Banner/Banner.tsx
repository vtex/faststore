import React from 'react'

type BannerDirectionVariant = 'vertical' | 'horizontal'
export interface BannerProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  children: React.ReactNode
  variant?: BannerDirectionVariant
}

const Banner = ({
  testId = 'store-banner',
  children,
  variant = 'vertical',
  ...otherProps
}: BannerProps) => {
  return (
    <article data-store-banner={variant} data-testid={testId} {...otherProps}>
      {children}
    </article>
  )
}

export default Banner
