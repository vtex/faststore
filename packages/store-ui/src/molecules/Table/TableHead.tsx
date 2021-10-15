import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface TableHeadProps
  extends HTMLAttributes<HTMLTableSectionElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
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
