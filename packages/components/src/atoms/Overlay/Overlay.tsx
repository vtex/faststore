import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface Props extends HTMLAttributes<HTMLDivElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Overlay = forwardRef<HTMLDivElement, Props>(function Overlay(
  { testId = 'fs-overlay', ...otherProps },
  ref
) {
  return (
    <div
      ref={ref}
      data-fs-overlay
      role="presentation"
      data-testid={testId}
      {...otherProps}
    />
  )
})

export default Overlay
