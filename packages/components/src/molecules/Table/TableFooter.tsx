import type { ComponentProps } from 'react'

export interface TableFooterProps extends ComponentProps<'tfoot'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
}

export default function TableFooter({
  children,
  testId = 'fs-table-footer',
  ref,
  ...otherProps
}: TableFooterProps) {
  return (
    <tfoot ref={ref} data-testid={testId} data-fs-table-footer {...otherProps}>
      {children}
    </tfoot>
  )
}
