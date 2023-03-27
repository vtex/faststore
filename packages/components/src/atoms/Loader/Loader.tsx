import React, { forwardRef } from 'react'

export type LoaderProps = {
  /**
   * Specifies the component color variant.
   */
  variant?: 'light' | 'dark'
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Loader = forwardRef<HTMLDivElement, LoaderProps>(function Loader(
  { variant = 'dark', testId = 'fs-loader', ...otherProps }: LoaderProps,
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
