import type { HTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

type TableCellVariant = 'data' | 'header'

export interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  testId?: string
  variant?: TableCellVariant
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attr-scope
  scope?: 'col' | 'row' | 'rowgroup' | 'colgroup'
}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  function TableCell(
    { testId = 'store-table-cell', children, variant = 'data', scope, ...rest },
    ref
  ) {
    const Cell = variant === 'header' ? 'th' : 'td'

    return (
      <Cell
        ref={ref}
        data-store-table-cell={variant}
        data-testid={testId}
        scope={scope}
        {...rest}
      >
        {children}
      </Cell>
    )
  }
)

export default TableCell
