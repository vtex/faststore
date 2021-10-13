import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface TableBodyProps
  extends HTMLAttributes<HTMLTableSectionElement> {
  testId?: string
  children: React.ReactNode
}

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody({ children, testId = 'store-table-body', ...rest }, ref) {
    return (
      <tbody ref={ref} data-testid={testId} data-store-table-body {...rest}>
        {children}
      </tbody>
    )
  }
)

export default TableBody
