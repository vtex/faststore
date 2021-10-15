import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

export interface TableFooterProps
  extends HTMLAttributes<HTMLTableSectionElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  children: React.ReactNode
}

const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  function TableFooter(
    { children, testId = 'store-table-footer', ...rest },
    ref
  ) {
    return (
      <tfoot ref={ref} data-testid={testId} data-store-table-footer {...rest}>
        {children}
      </tfoot>
    )
  }
)

export default TableFooter
