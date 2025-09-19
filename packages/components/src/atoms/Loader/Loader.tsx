import type { ComponentProps } from 'react'

export interface LoaderProps extends ComponentProps<'span'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
  /**
   * Specifies the component color variant.
   */
  variant?: 'light' | 'dark'
}

export default function Loader({
  testId = 'fs-loader',
  variant = 'dark',
  ref,
  ...otherProps
}: LoaderProps) {
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
}
