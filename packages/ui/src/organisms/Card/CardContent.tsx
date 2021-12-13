import type { HTMLAttributes, AriaAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Defines a string value that labels the current element.
   */
  'aria-label'?: AriaAttributes['aria-label']
}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  function CardContent(
    {
      testId = 'store-card-content',
      'aria-label': ariaLabel = 'Card content',
      children,
      ...otherProps
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        role="region"
        aria-label={ariaLabel}
        data-store-card-content
        data-testid={testId}
        {...otherProps}
      >
        {children}
      </div>
    )
  }
)

export default CardContent
