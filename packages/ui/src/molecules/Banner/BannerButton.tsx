import type { ButtonHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

import Button from '../../atoms/Button'

export interface BannerButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  children: React.ReactNode
}

const BannerButton = forwardRef<HTMLButtonElement, BannerButtonProps>(
  function BannerButton(
    { testId = 'store-banner-button', children, ...otherProps },
    ref
  ) {
    return (
      <Button
        ref={ref}
        data-store-banner-button
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </Button>
    )
  }
)

export default BannerButton
