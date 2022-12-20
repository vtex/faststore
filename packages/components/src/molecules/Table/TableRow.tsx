import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Children for TableRow components.
   */
  children: React.ReactNode
}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow(
    { testId = 'fs-table-row', children, ...otherProps },
    ref
  ) {
    return (
      <tr ref={ref} data-fs-table-row data-testid={testId} {...otherProps}>
        {children}
      </tr>
    )
  }
)

export default TableRow
