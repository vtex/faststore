import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

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
}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell(
    {
      testId = 'store-table-cell',
      children,
      variant = 'data',
      scope,
      ...otherProps
    },
    ref
  ) {
    const Cell = variant === 'header' ? 'th' : 'td'

    return (
      <Cell
        ref={ref}
        data-table-cell={variant}
        data-testid={testId}
        scope={scope}
        {...otherProps}
      >
        {children}
      </Cell>
    )
  }
)

export default TableCell
