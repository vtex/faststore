import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface Props extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Overlay = forwardRef<HTMLDivElement, Props>(function Overlay(
  { testId = 'store-overlay', ...otherProps },
  ref
) {
  return (
    <div
      role="presentation"
      data-fs-overlay
      data-testid={testId}
      ref={ref}
      {...otherProps}
    />
  )
})

export default Overlay
