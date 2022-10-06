import React, { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  testId?: string
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { testId = 'store-radio', ...otherProps }: RadioProps,
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
