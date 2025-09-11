import type { ComponentProps, ReactEventHandler } from 'react'
import React from 'react'

export interface TableProps extends ComponentProps<'table'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
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

export default function Table({
  children,
  variant = 'colored',
  testId = 'fs-table',
  ref,
  ...otherProps
}: TableProps) {
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
