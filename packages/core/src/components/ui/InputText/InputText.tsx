import { Input as UIInput, Label as UILabel } from '@faststore/ui'
import type { MutableRefObject } from 'react'
import type { InputProps } from '@faststore/ui'

import Button from 'src/components/ui/Button'
import Icon from 'src/components/ui/Icon'

import styles from './input-text.module.scss'

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

type ActionableInputText =
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

export type InputTextProps = DefaultProps &
  Omit<InputProps, 'disabled' | 'onSubmit'> &
  ActionableInputText

const InputText = ({
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
}: InputTextProps) => {
  const shouldDisplayError = !disabled && error && error !== ''
  const shouldDisplayButton = actionable && !disabled && value !== ''

  return (
    <div
      className={styles.fsInputText}
      data-fs-input-text
      data-fs-input-text-actionable={actionable}
      data-fs-input-text-error={error && error !== ''}
    >
      <UIInput
        id={id}
        type={type}
        value={value}
        ref={inputRef}
        disabled={disabled}
        placeholder={placeholder}
        {...otherProps}
      />
      <UILabel htmlFor={id}>{label}</UILabel>

      {shouldDisplayButton &&
        (displayClearButton || error ? (
          <Button
            variant="tertiary"
            data-fs-button-icon
            data-fs-button-size="small"
            aria-label="Clear Field"
            icon={<Icon name="XCircle" width={20} height={20} />}
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
        <span data-fs-input-text-error-message>{error}</span>
      )}
    </div>
  )
}

export default InputText
