import React from 'react'
import type { ComponentProps } from 'react'

export interface TableRowProps extends ComponentProps<'tr'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
}

export default function TableRow({
  children,
  testId = 'fs-table-row',
  ref,
  ...otherProps
}: TableRowProps) {
  return (
    <tr ref={ref} data-fs-table-row data-testid={testId} {...otherProps}>
      {children}
    </tr>
  )
}
