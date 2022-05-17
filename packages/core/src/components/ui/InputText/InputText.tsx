import { Input as UIInput, Label as UILabel } from '@faststore/ui'
import type { MutableRefObject } from 'react'
import { useEffect, useState } from 'react'
import type { InputProps } from '@faststore/ui'

import Button from 'src/components/ui/Button'
import ButtonIcon from 'src/components/ui/Button/ButtonIcon'
import Icon from 'src/components/ui/Icon'

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
  errorMessage?: string
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
      /**
       * Adds a Button to the component.
       */
      actionable: true
      /**
       * Callback function when button is clicked.
       */
      onSubmit: (value: string) => void
      /**
       * The text displayed on the Button. Suggestion: maximum 9 characters.
       */
      buttonActionText?: string
    }
  | {
      actionable?: false
      onSubmit?: never
      buttonActionText?: string
    }

export type InputTextProps = DefaultProps &
  Omit<InputProps, 'disabled'> &
  ActionableInputText

const InputText = ({
  id,
  label,
  type = 'text',
  errorMessage,
  actionable,
  buttonActionText = 'Apply',
  onSubmit,
  placeholder = ' ', // initializes with an empty space to style float label using `placeholder-shown`
  value,
  inputRef,
  disabled,
  ...otherProps
}: InputTextProps) => {
  const [inputValue, setInputValue] = useState<string>((value as string) ?? '')
  const [hasError, setHasError] = useState<boolean>(!!errorMessage)

  useEffect(() => {
    errorMessage && setHasError(true)
  }, [errorMessage])

  const onClear = () => {
    setInputValue('')
    inputRef?.current?.focus()
  }

  return (
    <div
      data-fs-input-text
      data-fs-input-text-error={hasError && inputValue !== ''}
      data-fs-input-text-actionable={actionable}
    >
      <UIInput
        type={type}
        id={id}
        ref={inputRef}
        placeholder={placeholder}
        value={inputValue}
        disabled={disabled}
        onInput={(e) => {
          hasError && setHasError(false)
          setInputValue(e.currentTarget.value)
        }}
        {...otherProps}
      />
      <UILabel htmlFor={id}>{label}</UILabel>

      {actionable &&
        !disabled &&
        inputValue !== '' &&
        (hasError ? (
          <ButtonIcon
            data-fs-button-size="small"
            aria-label="Clear Field"
            icon={<Icon name="XCircle" width={20} height={20} />}
            onClick={onClear}
          />
        ) : (
          <Button
            variant="tertiary"
            onClick={() => onSubmit(inputValue)}
            size="small"
          >
            {buttonActionText}
          </Button>
        ))}
      {hasError && !disabled && inputValue !== '' && (
        <span data-fs-input-text-message>{errorMessage}</span>
      )}
    </div>
  )
}

export default InputText
