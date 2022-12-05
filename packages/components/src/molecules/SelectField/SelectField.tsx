import React, { forwardRef } from 'react'
import type { PropsWithChildren } from 'react'
import Select from '../../atoms/Select'
import type {SelectProps} from '../../atoms/Select'
import Label from '../../atoms/Label'

export interface SelectFieldProps extends SelectProps {
  /**
   * Specifies the text that will be displayed in the label right next to the Select.
   */
  label: string
}

const SelectField = forwardRef<HTMLDivElement, PropsWithChildren<SelectFieldProps>>(
  function SelectField(
    { id, label, options, testId = 'fs-select-field', ...otherProps },
    ref
  ) {
    return (
      <div ref={ref} data-fs-select-field data-testid={testId}>
        <Label data-fs-select-field-label htmlFor={id}>{label}</Label>
        <Select id={id} options={options} {...otherProps} />
      </div>
    )
  }
)

export default SelectField
