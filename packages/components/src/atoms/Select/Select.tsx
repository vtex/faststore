import type { ComponentProps } from 'react'
import { Icon } from '../..'

export interface SelectProps extends ComponentProps<'select'> {
  /**
   * ID to find this component in testing tools (e.g.: testing library, and jest).
   */
  testId?: string
  /**
   * Assigns an identifier to link the UISelect component and its label.
   */
  id: string
  /**
   * Defines the options available in the select. The SelectOptions object
   * keys are the property names, while the values correspond to the text that
   * will be displayed in the UI.
   */
  options: Record<string, string>
}

export default function Select({
  options,
  id,
  testId = 'fs-select',
  ref,
  ...otherProps
}: SelectProps) {
  return (
    <div data-fs-select>
      <select ref={ref} id={id} data-testid={testId} {...otherProps}>
        {Object.keys(options).map((key) => (
          <option key={key} value={key}>
            {options[key]}
          </option>
        ))}
      </select>
      <Icon data-fs-select-icon name="CaretDown" />
    </div>
  )
}
