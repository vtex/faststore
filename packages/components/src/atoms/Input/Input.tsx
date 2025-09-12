import type { ComponentProps } from 'react'
import React from 'react'

export interface InputProps extends ComponentProps<'input'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
}

export default function Input({
  testId = 'fs-input',
  ref,
  ...otherProps
}: InputProps) {
  return <input ref={ref} data-fs-input data-testid={testId} {...otherProps} />
}
