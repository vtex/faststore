import { Label, Select } from '../..'
import type { SelectProps } from '../../atoms/Select'

export interface SelectFieldProps extends SelectProps {
  /**
   * Defines the text displayed in the label right next to the Select.
   */
  label: string
}

export default function SelectField({
  id,
  label,
  options,
  testId = 'fs-select-field',
  ref,
  ...otherProps
}: SelectFieldProps) {
  return (
    <div data-fs-select-field>
      <Label data-fs-select-field-label htmlFor={id}>
        {label}
      </Label>
      <Select
        id={id}
        ref={ref}
        options={options}
        data-testid={testId}
        {...otherProps}
      />
    </div>
  )
}
