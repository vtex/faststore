import React, { forwardRef } from 'react'
import type { HTMLAttributes, PropsWithChildren } from 'react'

export interface TableBodyProps
  extends HTMLAttributes<HTMLTableSectionElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const TableBody = forwardRef<
  HTMLTableSectionElement,
  PropsWithChildren<TableBodyProps>
>(function TableBody(
  { children, testId = 'fs-table-body', ...otherProps },
  ref
) {
  return (
    <tbody ref={ref} data-testid={testId} data-fs-table-body {...otherProps}>
      {children}
    </tbody>
  )
})

export default TableBody
