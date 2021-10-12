import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface TableHeadProps
  extends HTMLAttributes<HTMLTableSectionElement> {
  testId?: string
  children: React.ReactNode
}

const TableHead = forwardRef<HTMLTableSectionElement, TableHeadProps>(
  function TableHead({ children, testId = 'store-table-head', ...rest }, ref) {
    return (
      <thead ref={ref} data-testid={testId} data-store-table-head {...rest}>
        {children}
      </thead>
    )
  }
)

export default TableHead
