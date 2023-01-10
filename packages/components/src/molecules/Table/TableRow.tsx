import React, { forwardRef } from 'react'
import type { HTMLAttributes, PropsWithChildren } from 'react'

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const TableRow = forwardRef<
  HTMLTableRowElement,
  PropsWithChildren<TableRowProps>
>(function TableRow({ children, testId = 'fs-table-row', ...otherProps }, ref) {
  return (
    <tr ref={ref} data-fs-table-row data-testid={testId} {...otherProps}>
      {children}
    </tr>
  )
})

export default TableRow
