import React, { forwardRef } from 'react'
import type { PropsWithChildren } from 'react'

import { Label, Select } from '../..'
import type { SelectProps } from '../../atoms/Select'

export interface SelectFieldProps extends SelectProps {
  /**
   * Defines the text displayed in the label right next to the Select.
   */
  label: string
}

const SelectField = forwardRef<
  HTMLDivElement,
  PropsWithChildren<SelectFieldProps>
>(function SelectField(
  { id, label, options, testId = 'fs-select-field', ...otherProps },
  ref
) {
  return (
    <div ref={ref} data-fs-select-field>
      <Label data-fs-select-field-label htmlFor={id}>
        {label}
      </Label>
      <Select id={id} options={options} data-testid={testId} {...otherProps} />
    </div>
  )
})

export default SelectField
