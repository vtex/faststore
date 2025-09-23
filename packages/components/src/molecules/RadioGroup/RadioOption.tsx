import type { ComponentProps } from 'react'

import Radio from '../../atoms/Radio'
import { useRadioGroup } from './useRadioGroup'

export interface RadioOptionProps
  extends Omit<ComponentProps<'input'>, 'type'> {
  /**
   * ID to find this component in testing tools (e.g.: testing-library, and jest).
   */
  testId?: string
  /**
   * Attribute to set aria-label option as required.
   */
  label: string
  /**
   * Value to be emitted when radio is clicked.
   */
  value: string | number
}

export default function RadioOption({
  label,
  value,
  children,
  testId = 'fs-radio-group-option',
  ref,
  ...otherProps
}: RadioOptionProps) {
  const { name, selectedValue, onChange } = useRadioGroup()

  return (
    <label aria-label={label} data-fs-radio-group-option>
      <Radio
        data-fs-radio-option-item
        ref={ref}
        name={name}
        checked={value === selectedValue}
        onChange={onChange}
        value={value}
        testId={testId}
        {...otherProps}
      />
      {children}
    </label>
  )
}
