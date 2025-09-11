import type { ComponentProps } from 'react'
import React from 'react'

export interface IncentiveProps extends ComponentProps<'section'> {
  /**
   * ID to find this component in testing tools (e.g.: testing-library, and jest).
   */
  testId?: string
}

export default function Incentive({
  testId = 'store-incentive',
  children,
  ref,
  ...otherProps
}: IncentiveProps) {
  return (
    <section ref={ref} data-fs-incentive data-testid={testId} {...otherProps}>
      {children}
    </section>
  )
}
