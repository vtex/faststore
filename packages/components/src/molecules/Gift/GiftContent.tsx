import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface GiftContentProps extends HTMLAttributes<HTMLElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const GiftContent = forwardRef<HTMLElement, GiftContentProps>(
  function GiftContent(
    { testId = 'fs-gift-content', children, ...otherProps },
    ref
  ) {
    return (
      <section
        ref={ref}
        data-fs-gift-content
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </section>
    )
  }
)

export default GiftContent
