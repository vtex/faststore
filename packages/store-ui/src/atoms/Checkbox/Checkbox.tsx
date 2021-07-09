import React, { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

export interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  testId?: string
}

const Checkbox = forwardRef<HTMLInputElement, Props>(function Checkbox(
  { testId = 'store-checkbox', ...props }: Props,
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
