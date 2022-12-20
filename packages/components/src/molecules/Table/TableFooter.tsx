import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface TableFooterProps
  extends HTMLAttributes<HTMLTableSectionElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Children for TableFooter components.
   */
  children: React.ReactNode
}

const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  function TableFooter(
    { children, testId = 'fs-table-footer', ...otherProps },
    ref
  ) {
    return (
      <tfoot ref={ref} data-testid={testId} data-fs-table-footer {...otherProps}>
        {children}
      </tfoot>
    )
  }
)

export default TableFooter
