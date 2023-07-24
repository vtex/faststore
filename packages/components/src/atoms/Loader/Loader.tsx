import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface LoaderProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
   /**
   * Specifies the component color variant.
   */
   variant?: 'light' | 'dark'
}

const Loader = forwardRef<HTMLDivElement, LoaderProps>(function Loader(
  { testId = 'fs-loader', variant = 'dark', ...otherProps }: LoaderProps,
  ref
) {
  return (
    <span
      ref={ref}
      data-fs-loader
      data-fs-loader-variant={variant}
      data-testid={testId}
      {...otherProps}
    >
      <span data-fs-loader-item></span>
      <span data-fs-loader-item></span>
      <span data-fs-loader-item></span>
    </span>
  )
})

export default Loader
