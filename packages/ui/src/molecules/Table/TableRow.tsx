import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  children: React.ReactNode
}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow(
    { testId = 'store-table-row', children, ...otherProps },
    ref
  ) {
    return (
      <tr ref={ref} data-table-row data-testid={testId} {...otherProps}>
        {children}
      </tr>
    )
  }
)

export default TableRow
