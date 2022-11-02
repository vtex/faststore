import React, { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { testId = 'fs-radio', ...otherProps }: RadioProps,
  ref
) {
  return (
    <input
      ref={ref}
      data-fs-radio
      data-testid={testId}
      type="radio"
      {...otherProps}
    />
  )
})

export default Radio
