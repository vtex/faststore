import { Select as UISelect, Label as UILabel } from '@faststore/ui'
import type { SelectProps } from '@faststore/ui'

import Icon from 'src/components/ui/Icon'

import styles from './select.module.scss'

export interface UISelectProps extends SelectProps {
  /*
   * Redefines the id property to be required when using the Select component. The
   * id will be used to link the UISelect component and its label.
   */
  id: string
  /*
   * Defines the options available in the select. The SelectOptions object
   * keys are the property names, while the values correspond to the text that
   * will be displayed in the UI
   */
  options: Record<string, string>
  /*
   * Specifies the text that will be displayed in the label right next to the Select.
   * If omitted, the label will not be rendered.
   */
  label?: string
}

export default function Select({
  id,
  className,
  options,
  onChange,
  label,
  value,
  'aria-label': ariaLabel,
  testId,
  ...otherProps
}: UISelectProps) {
  return (
    <div data-fs-select className={`${styles.fsSelect} ${className}`}>
      {label && (
        <UILabel data-fs-select-label htmlFor={id}>
          {label}
        </UILabel>
      )}
      <UISelect
        data-testid={testId}
        onChange={onChange}
        value={value}
        aria-label={ariaLabel}
        id={id}
        {...otherProps}
      >
        {Object.keys(options).map((key) => (
          <option key={key} value={key}>
            {options[key]}
          </option>
        ))}
      </UISelect>
      <Icon
        data-fs-select-icon
        name="CaretDown"
        width={18}
        height={18}
        weight="bold"
      />
    </div>
  )
}
