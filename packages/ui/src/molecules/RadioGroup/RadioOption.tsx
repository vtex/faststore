import type { InputHTMLAttributes } from 'react'
import React, { forwardRef } from 'react'

import { Radio } from '../..'
import { useRadioOption } from './useRadioOption'

export interface RadioOptionProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  testId?: string
  label: string
  value: string | number
  children?: React.ReactNode
}

export interface RadioOptionChildrenProps {
  checked: boolean
  label: string
  value: string | number
}

const RadioOption = forwardRef<HTMLInputElement, RadioOptionProps>(
  function RadioOption({ label, value, children, ...otherOptions }, ref) {
    const { name, option, onChange } = useRadioOption()

    const checked = value === option

    return (
      <label aria-label={label} data-store-radio-option>
        <Radio
          {...otherOptions}
          ref={ref}
          name={name}
          checked={checked}
          onChange={() => {
            onChange?.(value)
          }}
        />
        {children}
      </label>
    )
  }
)

export default RadioOption
