import React from 'react'
import type { MutableRefObject } from 'react'

import { Input, Label, IconButton, Button } from '../../index'
import type { InputProps } from '../../index'
import { XCircle } from '../../assets'

type DefaultProps = {
  /**
   * ID to identify input and corresponding label.
   */
  id: string
  /**
   * The text displayed to identify input text.
   */
  label: string
  /**
   * The error message is displayed when an error occurs.
   */
  error?: string
  /**
   * Component's ref.
   */
  inputRef?: MutableRefObject<HTMLInputElement | null>
  /**
   * Specifies that the whole input component should be disabled.
   */
  disabled?: boolean
}

type ActionableInputField =
  | {
      actionable?: never
      onSubmit?: never
      onClear?: never
      buttonActionText?: string
      displayClearButton?: never
    }
  | {
      /**
       * Adds a Button to the component.
       */
      actionable: true
      /**
       * Callback function when button is clicked. Required for actionable input.
       */
      onSubmit: () => void
      /**
       * Callback function when clear button is clicked. Required for actionable input.
       */
      onClear: () => void
      /**
       * The text displayed on the Button. Suggestion: maximum 9 characters.
       */
      buttonActionText?: string
      /**
       * Boolean that controls the clear button.
       */
      displayClearButton?: boolean
    }

export type InputFieldProps = DefaultProps &
  Omit<InputProps, 'disabled' | 'onSubmit'> &
  ActionableInputField

const InputField = ({
  id,
  label,
  type = 'text',
  error,
  displayClearButton,
  actionable,
  buttonActionText = 'Apply',
  onSubmit,
  onClear,
  placeholder = ' ', // initializes with an empty space to style float label using `placeholder-shown`
  inputRef,
  disabled,
  value,
  ...otherProps
}: InputFieldProps) => {
  const shouldDisplayError = !disabled && error && error !== ''
  const shouldDisplayButton = actionable && !disabled && value !== ''

  return (
    <div
      data-fs-input-field
      data-fs-input-field-actionable={actionable}
      data-fs-input-field-error={error && error !== ''}
    >
      <Input
        id={id}
        type={type}
        value={value}
        ref={inputRef}
        disabled={disabled}
        placeholder={placeholder}
        {...otherProps}
      />
      <Label htmlFor={id}>{label}</Label>

      {shouldDisplayButton &&
        (displayClearButton || error ? (
          <IconButton
            data-fs-button-size="small"
            aria-label="Clear Field"
            icon={<XCircle />}
            onClick={() => {
              onClear?.()
              inputRef?.current?.focus()
            }}
          />
        ) : (
          <Button variant="tertiary" size="small" onClick={onSubmit}>
            {buttonActionText}
          </Button>
        ))}
      {shouldDisplayError && (
        <span data-fs-input-field-error-message>{error}</span>
      )}
    </div>
  )
}

export default InputField
