import React, { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { testId = 'store-card', children, ...otherProps },
  ref
) {
  return (
    <article ref={ref} data-store-card data-testid={testId} {...otherProps}>
      {children}
    </article>
  )
})

export default Card
