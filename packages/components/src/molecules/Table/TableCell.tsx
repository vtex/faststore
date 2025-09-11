import React from 'react'
import type { ComponentProps } from 'react'

type TableCellVariant = 'data' | 'header'

export interface TableCellProps extends ComponentProps<'td'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
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

export default function TableCell({
  scope,
  align,
  children,
  variant = 'data',
  testId = 'fs-table-cell',
  ref,
  ...otherProps
}: TableCellProps) {
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
}
