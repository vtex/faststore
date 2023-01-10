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
  /**
   * Call a function when the component is resized.
   */
  onResize?: ReactEventHandler<unknown> | undefined
  /**
   * A version of onResize that fires in the capture phase.
   */
  onResizeCapture?: ReactEventHandler<unknown> | undefined
  /**
   * A randomly generated string that is only used once.
   */
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
