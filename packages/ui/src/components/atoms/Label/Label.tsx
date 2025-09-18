import React from 'react'
import type { ComponentProps } from 'react'

export interface LabelProps extends ComponentProps<'label'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
}

export default function Label({
  testId = 'fs-label',
  children,
  ref,
  ...otherProps
}: LabelProps) {
  return (
    <label ref={ref} data-fs-label data-testid={testId} {...otherProps}>
      {children}
    </label>
  )
}
