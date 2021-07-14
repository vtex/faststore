/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type { InputHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Current variant of the input.
   */
  variant?: 'success' | 'error'
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { variant, testId = 'store-input', ...props },
  ref
) {
  const variants = {
    'data-error': variant === 'error' || undefined,
    'data-success': variant === 'success' || undefined,
  }

  return (
    <input
      ref={ref}
      data-store-input
      data-testid={testId}
      {...variants}
      {...props}
    />
  )
})

export default Input
