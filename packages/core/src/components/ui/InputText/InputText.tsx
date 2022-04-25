import { Input as UIInput, Label as UILabel } from '@faststore/ui'
import { useEffect, useRef, useState } from 'react'
import type { InputProps } from '@faststore/ui'

import Button from 'src/components/ui/Button'
import IconButton from 'src/components/ui/Button/ButtonIcon'
import Icon from 'src/components/ui/Icon'

export type InputTextProps = {
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

type Props = InputTextProps & InputProps & ActionableInputText

const InputText = ({
  id,
  label,
  type = 'text',
  errorMessage,
  actionable,
  buttonActionText = 'Apply',
  onSubmit,
  placeholder = ' ', // initializes with an empty space to style float label using `placeholder-shown`
  ...otherProps
}: Props) => {
  const [inputValue, setInputValue] = useState<string>('')
  const [hasError, setHasError] = useState<boolean>(!!errorMessage)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    errorMessage && setHasError(true)
  }, [errorMessage])

  const onClear = () => {
    setInputValue('')
    inputRef.current?.focus()
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
        onInput={(e) => {
          hasError && setHasError(false)
          setInputValue(e.currentTarget.value)
        }}
        {...otherProps}
      />
      <UILabel htmlFor={id}>{label}</UILabel>

      {actionable &&
        inputValue !== '' &&
        (hasError ? (
          <IconButton
            data-fs-input-text-button
            aria-label="Clear Field"
            icon={<Icon name="XCircle" width={20} height={20} />}
            onClick={onClear}
          />
        ) : (
          <Button
            data-fs-input-text-button
            variant="tertiary"
            onClick={() => onSubmit(inputValue)}
          >
            {buttonActionText}
          </Button>
        ))}
      {hasError && inputValue !== '' && (
        <span data-fs-input-text-message>{errorMessage}</span>
      )}
    </div>
  )
}

export default InputText
