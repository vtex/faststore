import type { ComponentProps } from 'react'

export interface TextareaProps extends ComponentProps<'textarea'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
  /**
   * Controls the resize property of the textare (e.g.: none, vertical, horizontal, both).
   * Default is 'both'.
   */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

export default function Textarea({
  testId = 'fs-textarea',
  resize = 'both',
  ref,
  ...otherProps
}: TextareaProps) {
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
