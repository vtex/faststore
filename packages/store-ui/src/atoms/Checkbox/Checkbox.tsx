import React, { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  testId?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { testId = 'store-checkbox', ...props }: CheckboxProps,
  ref
) {
  return (
    <input
      ref={ref}
      data-store-checkbox
      data-testid={testId}
      type="checkbox"
      {...props}
    />
  )
})

export default Checkbox
