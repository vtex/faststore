import type {
  DetailedHTMLProps,
  PropsWithChildren,
  ReactEventHandler,
  TableHTMLAttributes,
} from 'react'
import React, { forwardRef } from 'react'

export interface TableProps
  extends DetailedHTMLProps<
    TableHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
  > {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Defines what style this component should use.
   */
  variant?: 'colored' | 'bordered'
  onResize?: ReactEventHandler<unknown> | undefined
  onResizeCapture?: ReactEventHandler<unknown> | undefined
  nonce?: string | undefined
}

const Table = forwardRef<HTMLTableElement, PropsWithChildren<TableProps>>(
  function Table(
    { children, variant = 'colored', testId = 'fs-table', ...otherProps },
    ref
  ) {
    return (
      <div data-fs-table>
        <table
          ref={ref}
          data-fs-table-content
          data-fs-table-variant={variant}
          data-testid={testId}
          {...otherProps}
        >
          {children}
        </table>
      </div>
    )
  }
)

export default Table
