import React, { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  testId?: string
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { testId = 'store-radio', ...props }: RadioProps,
  ref
) {
  return (
    <input
      ref={ref}
      data-store-radio
      data-testid={testId}
      type="radio"
      {...props}
    />
  )
})

export default Radio
