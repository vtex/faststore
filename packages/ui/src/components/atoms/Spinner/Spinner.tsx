import type { PropsWithChildren } from 'react'
import React, { forwardRef } from 'react'

export type SpinnerProps = {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Spinner = forwardRef<HTMLDivElement, PropsWithChildren<SpinnerProps>>(
  function Spinner({ children, testId = 'store-spinner', ...otherProps }, ref) {
    return (
      <span ref={ref} data-fs-spinner data-testid={testId} {...otherProps} />
    )
  }
)

export default Spinner
