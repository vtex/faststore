import React, { forwardRef } from 'react'

export interface SpinnerProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(function Spinner(
  { children, testId = 'store-spinner', ...props },
  ref
) {
  return (
    <span ref={ref} data-store-spinner data-testid={testId} {...props}>
      {children}
    </span>
  )
})

export default Spinner
