import type { TextareaHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Controls the resize property of the textare (e.g.: none, vertical, horizontal, both).
   * Default is 'both'.
   */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { testId = 'fs-textarea', resize = 'both', ...otherProps },
    ref
  ) {
    return (
      <textarea
        ref={ref}
        data-fs-textarea
        data-fs-textarea-resize={resize}
        data-testid={testId}
        {...otherProps}
      />
    )
  }
)
export default Textarea
