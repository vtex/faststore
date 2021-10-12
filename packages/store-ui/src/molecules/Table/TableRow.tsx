import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  testId?: string
  children: React.ReactNode
}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  function TableRow({ testId = 'store-table-row', children, ...rest }, ref) {
    return (
      <tr ref={ref} data-store-table-row data-testid={testId} {...rest}>
        {children}
      </tr>
    )
  }
)

export default TableRow
