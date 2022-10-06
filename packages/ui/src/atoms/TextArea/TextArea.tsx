import type { TextareaHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface TextAreaProps
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

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(
    { variant, testId = 'store-textarea', ...otherProps },
    ref
  ) {
    const variants = {
      'data-success': variant === 'success' || undefined,
      'data-error': variant === 'error' || undefined,
    }

    return (
      <textarea
        ref={ref}
        data-fs-textarea
        data-testid={testId}
        {...variants}
        {...otherProps}
      />
    )
  }
)

export default TextArea
