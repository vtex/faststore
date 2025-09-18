import React from 'react'
import type { ComponentProps } from 'react'

export interface TableHeadProps extends ComponentProps<'thead'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
}

export default function TableHead({
  children,
  testId = 'fs-table-head',
  ref,
  ...otherProps
}: TableHeadProps) {
  return (
    <thead ref={ref} data-testid={testId} data-fs-table-head {...otherProps}>
      {children}
    </thead>
  )
}
