import React from 'react'

export interface BannerProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  children: React.ReactNode
}

const Banner = ({ testId = 'store-banner', children }: BannerProps) => {
  return (
    <section data-store-banner data-testid={testId}>
      {children}
    </section>
  )
}

export default Banner
