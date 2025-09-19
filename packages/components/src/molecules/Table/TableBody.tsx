import type { ComponentProps } from 'react'

export interface TableBodyProps extends ComponentProps<'tbody'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
}

export default function TableBody({
  children,
  testId = 'fs-table-body',
  ref,
  ...otherProps
}: TableBodyProps) {
  return (
    <tbody ref={ref} data-testid={testId} data-fs-table-body {...otherProps}>
      {children}
    </tbody>
  )
}
