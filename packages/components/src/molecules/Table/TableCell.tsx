import React, { forwardRef } from 'react'
import type { HTMLAttributes, PropsWithChildren } from 'react'

type TableCellVariant = 'data' | 'header'

export interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Specify if this component should be rendered as a header (`<th>`) or as a data cell (`<td>`).
   */
  variant?: TableCellVariant
  /**
   * Defines the cells that the header element (`<th>`) relates to.
   * @see scope https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attr-scope
   */
  scope?: 'col' | 'row' | 'rowgroup' | 'colgroup'
  /**
   * Defines how this component should be aligned.
   */
  align?: 'left' | 'center' | 'right'
}

const TableCell = forwardRef<
  HTMLTableCellElement,
  PropsWithChildren<TableCellProps>
>(function TableCell(
  {
    scope,
    align,
    children,
    variant = 'data',
    testId = 'fs-table-cell',
    ...otherProps
  },
  ref
) {
  const Cell = variant === 'header' ? 'th' : 'td'

  return (
    <Cell
      ref={ref}
      data-fs-table-cell={variant}
      data-fs-table-cell-align={align}
      data-testid={testId}
      scope={scope}
      {...otherProps}
    >
      {children}
    </Cell>
  )
})

export default TableCell
