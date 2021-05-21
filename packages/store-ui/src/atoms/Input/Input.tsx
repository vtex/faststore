/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type { InputHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  state?: 'success' | 'error'
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { state, ...props },
  ref
) {
  const states = {
    'data-error': state === 'error' || undefined,
    'data-success': state === 'success' || undefined,
  }

  return <input ref={ref} data-store-input {...states} {...props} />
})

export default Input
