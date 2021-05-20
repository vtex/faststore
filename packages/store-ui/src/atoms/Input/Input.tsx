import type { InputHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { isError, ...props },
  ref
) {
  const commonProps = {
    ref,
    'data-store-input': '',
    ...props,
  }

  const errorProp = isError
    ? {
        'data-error': '',
      }
    : {}

  const allProps = {
    ...commonProps,
    ...errorProp,
  }

  return <input {...allProps} />
})

export default Input
