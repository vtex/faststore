import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface CardImageProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const CardImage = forwardRef<HTMLDivElement, CardImageProps>(function CardImage(
  { testId = 'store-card-image', children, ...otherProps },
  ref
) {
  return (
    <div ref={ref} data-store-card-image data-testid={testId} {...otherProps}>
      {children}
    </div>
  )
})

export default CardImage
