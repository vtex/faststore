import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface CardContentProps extends HTMLAttributes<HTMLElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const CardContent = forwardRef<HTMLElement, CardContentProps>(
  function CardContent(
    { testId = 'store-card-content', children, ...otherProps },
    ref
  ) {
    return (
      <section
        ref={ref}
        data-store-card-content
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </section>
    )
  }
)

export default CardContent
