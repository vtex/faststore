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
    <div data-store-banner data-testid={testId}>
      {children}
    </div>
  )
}

export default Banner
