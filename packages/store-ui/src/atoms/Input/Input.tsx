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

  const states = {
    ...(error && { 'data-error': '' }),
    ...(success && { 'data-success': '' }),
  }

  return <input {...commonProps} {...states} />
})

export default Input
