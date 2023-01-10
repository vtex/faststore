import React, { forwardRef } from 'react'
import type { HTMLAttributes, PropsWithChildren } from 'react'

export interface TableHeadProps
  extends HTMLAttributes<HTMLTableSectionElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const TableHead = forwardRef<
  HTMLTableSectionElement,
  PropsWithChildren<TableHeadProps>
>(function TableHead(
  { children, testId = 'fs-table-head', ...otherProps },
  ref
) {
  return (
    <thead ref={ref} data-testid={testId} data-fs-table-head {...otherProps}>
      {children}
    </thead>
  )
})

export default TableHead
