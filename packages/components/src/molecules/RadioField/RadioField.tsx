import type { HTMLAttributes, ReactNode, ComponentProps } from 'react'
import React from 'react'

import Label from '../../atoms/Label'
import Radio from '../../atoms/Radio'

type EnhancedRadioFieldProps = HTMLAttributes<HTMLDivElement> &
  Pick<ComponentProps<'input'>, 'checked' | 'ref'>

export interface RadioFieldProps extends EnhancedRadioFieldProps {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
  /**
   * ID to identify input and corresponding label.
   */
  id: string
  /**
   * The text or component displayed to identify the input radio.
   */
  label: string | ReactNode
  /**
   * The value to identify the input radio.
   */
  value?: string
  /**
   * Identify radio in the same group.
   */
  name?: string
}

export default function RadioField({
  testId = 'fs-radio-field',
  id,
  label,
  value,
  name,
  ref,
  ...otherProps
}: RadioFieldProps) {
  return (
    <div ref={ref} data-fs-radio-field data-testid={testId}>
      <Radio
        id={id}
        value={typeof label === 'string' ? label : value}
        name={name}
        {...otherProps}
      />
      <Label htmlFor={id}>{label}</Label>
    </div>
  )
}
