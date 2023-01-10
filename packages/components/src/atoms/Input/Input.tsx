import type { InputHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { testId = 'fs-input', ...otherProps },
  ref
) {
  return <input ref={ref} data-fs-input data-testid={testId} {...otherProps} />
})

export default Input
