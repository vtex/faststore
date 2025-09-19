import type { ComponentProps } from 'react'

export interface CheckboxProps extends Omit<ComponentProps<'input'>, 'type'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
  /**
   * Boolean that represents a partial state.
   */
  partial?: boolean
}

export default function Checkbox({
  testId = 'fs-checkbox',
  partial,
  ref,
  ...otherProps
}: CheckboxProps) {
  return (
    <input
      ref={ref}
      data-fs-checkbox
      data-testid={testId}
      data-fs-checkbox-partial={partial}
      type="checkbox"
      {...otherProps}
    />
  )
}
