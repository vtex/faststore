import type { InputHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  success?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { error, success, ...props },
  ref
) {
  const commonProps = {
    ref,
    'data-store-input': '',
    ...props,
  }

  const errorProp = error
    ? {
        'data-error': '',
      }
    : {}

  const successProp = success
    ? {
        'data-success': '',
      }
    : {}

  const allProps = {
    ...commonProps,
    ...errorProp,
    ...successProp,
  }

  return <input {...allProps} />
})

export default Input
