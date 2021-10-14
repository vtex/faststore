import type { ButtonHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface ButtonProps<T = HTMLButtonElement>
  extends ButtonHTMLAttributes<T> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, testId = 'store-button', ...props },
  ref
) {
  return (
    <button
      style={{ minWidth: '48px', minHeight: '48px', paddingLeft: '8px' }}
      ref={ref}
      data-store-button
      data-testid={testId}
      {...props}
    >
      {children}
    </button>
  )
})

export default Button
