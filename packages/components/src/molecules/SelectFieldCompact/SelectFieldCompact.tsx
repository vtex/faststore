import type { MutableRefObject } from 'react'
import React, { forwardRef } from 'react'

import { Icon, Label, Loader } from '../..'
import type { SelectProps } from '../../atoms/Select'

export interface SelectFieldCompactProps
  extends Omit<SelectProps, 'testId' | 'ref'> {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * ID to identify select and corresponding label.
   */
  id: string
  /**
   * The text displayed to identify the select field.
   */
  label: string
  /**
   * The error message is displayed when an error occurs.
   */
  error?: string
  /**
   * Component's ref.
   */
  selectRef?: MutableRefObject<HTMLSelectElement | null>
  /**
   * Specifies that the whole select component should be disabled.
   */
  disabled?: boolean
  /**
   * Specifies if the component is in a loading state.
   */
  loading?: boolean
  /**
   * Defines the options available in the select. The SelectOptions object
   * keys are the property names, while the values correspond to the text that
   * will be displayed in the UI.
   */
  options: Record<string, string>
}

const SelectFieldCompact = forwardRef<HTMLDivElement, SelectFieldCompactProps>(
  function SelectFieldCompact(
    {
      id,
      label,
      error,
      selectRef,
      disabled,
      loading = false,
      options,
      value,
      testId = 'fs-select-field-compact',
      ...otherProps
    },
    ref
  ) {
    const shouldDisplayError = !disabled && error && error !== ''

    return (
      <div
        ref={ref}
        data-fs-select-field-compact
        data-fs-select-field-compact-error={shouldDisplayError}
        data-fs-select-field-compact-disabled={disabled}
        data-fs-select-field-compact-loading={loading}
        data-testid={testId}
      >
        <div data-fs-select-field-compact-wrapper>
          <select
            ref={selectRef}
            id={id}
            value={value}
            disabled={disabled || loading}
            data-fs-select-field-compact-select
            {...otherProps}
          >
            {Object.keys(options).map((key) => (
              <option key={key} value={key}>
                {options[key]}
              </option>
            ))}
          </select>
          <Label data-fs-select-field-compact-label htmlFor={id}>
            {label}
          </Label>
          {loading ? (
            <Loader
              data-fs-select-field-compact-loader
              variant="dark"
              aria-label="Loading"
            />
          ) : (
            <Icon data-fs-select-field-compact-icon name="CaretDown" />
          )}
        </div>
        {shouldDisplayError && (
          <span data-fs-select-field-compact-error-message>{error}</span>
        )}
      </div>
    )
  }
)

export default SelectFieldCompact
