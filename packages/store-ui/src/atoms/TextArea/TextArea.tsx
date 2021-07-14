import type { TextareaHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface Props
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> {
  /**
   * Current state of the input.
   */
  state?: 'success' | 'error'
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const TextArea = forwardRef<HTMLTextAreaElement, Props>(function TextArea(
  { state, testId = 'store-textarea', ...props },
  ref
) {
  const states = {
    'data-success': state === 'success' || undefined,
    'data-error': state === 'error' || undefined,
  }

  return (
    <textarea
      ref={ref}
      data-store-textarea
      data-testid={testId}
      {...states}
      {...props}
    />
  )
})

export default TextArea
