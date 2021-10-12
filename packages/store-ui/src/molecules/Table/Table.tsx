import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  testId?: string
  children: React.ReactNode
}

const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { testId = 'store-table', children, ...rest },
  ref
) {
  return (
    <table ref={ref} data-store-table data-testid={testId} {...rest}>
      {children}
    </table>
  )
})

export default Table
