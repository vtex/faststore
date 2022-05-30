import { Input as UIInput, Label as UILabel } from '@faststore/ui'
import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

import Icon from 'src/components/ui/Icon'
import SROnly from 'src/components/ui/SROnly'

import styles from './toggle.module.scss'

export interface ToggleProps
  extends InputHTMLAttributes<Omit<HTMLInputElement, 'disabled' | 'type'>> {
  /**
   * ID to identify input and corresponding label.
   */
  id: string
  /**
   * The text displayed to identify the input.
   */
  label: string
  /**
   * Controls whether the label will be displayed or not.
   */
  displayLabel?: boolean
  /**
   * Specifies that this input should be disabled.
   */
  disabled?: boolean
  /**
   * Controls the component's direction.
   */
  variant?: 'horizontal' | 'vertical'
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle(
  {
    id,
    label,
    disabled,
    displayLabel = true,
    variant = 'horizontal',
    ...otherProps
  }: ToggleProps,
  ref
) {
  return (
    <div
      data-fs-toggle
      data-fs-toggle-variant={variant}
      className={styles.fsToggle}
    >
      <div data-fs-toggle-container>
        <UIInput
          id={id}
          ref={ref}
          role="switch"
          type="checkbox"
          disabled={disabled}
          {...otherProps}
        />
        <span data-fs-toggle-knob>
          <Icon width={15} height={15} weight="bold" name="Checked" />
        </span>
      </div>
      {displayLabel ? (
        <UILabel data-fs-label htmlFor={id}>
          {label}
        </UILabel>
      ) : (
        <SROnly text={label} />
      )}
    </div>
  )
})

export default Toggle
