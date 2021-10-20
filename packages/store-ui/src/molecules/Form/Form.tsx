import type { FormHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
}

const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  { testId = 'store-form', children, ...otherProps },
  ref
) {
  return (
    <form ref={ref} data-store-form data-testid={testId} {...otherProps}>
      {children}
    </form>
  )
})

export default Form
