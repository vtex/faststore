import type { TextareaHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface Props
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> {
  /**
   * Current variant of the input.
   */
  variant?: 'success' | 'error'
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const TextArea = forwardRef<HTMLTextAreaElement, Props>(function TextArea(
  { variant, testId = 'store-textarea', ...props },
  ref
) {
  const variants = {
    'data-success': variant === 'success' || undefined,
    'data-error': variant === 'error' || undefined,
  }

  return (
    <textarea
      ref={ref}
      data-store-textarea
      data-testid={testId}
      {...variants}
      {...props}
    />
  )
})

export default TextArea
