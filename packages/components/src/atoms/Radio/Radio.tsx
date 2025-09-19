import type { ComponentProps } from 'react'

export interface RadioProps extends Omit<ComponentProps<'input'>, 'type'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
}

export default function Radio({
  testId = 'fs-radio',
  ref,
  ...otherProps
}: RadioProps) {
  return (
    <input
      ref={ref}
      data-fs-radio
      type="radio"
      data-testid={testId}
      {...otherProps}
    />
  )
}
