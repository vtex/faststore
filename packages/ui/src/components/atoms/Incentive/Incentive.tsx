import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface IncentiveProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

const Incentive = forwardRef<HTMLDivElement, IncentiveProps>(function Incentive(
  { testId = 'store-incentive', children, ...otherProps },
  ref
) {
  return (
    <section ref={ref} data-fs-incentive data-testid={testId} {...otherProps}>
      {children}
    </section>
  )
})

export default Incentive
