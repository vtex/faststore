import type {
  AriaAttributes,
  FormEvent,
  InputHTMLAttributes,
  ReactNode
} from 'react'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'

import { Icon, IconButton, Input } from '../..'

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onSubmit'>

type ButtonProps = {
  onClick?: () => void
  testId?: string
}
export interface SearchInputFieldProps extends InputProps {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
  /**
   * Props for the submit button inside the input.
   */
  buttonProps?: ButtonProps
  /**
   * A React component that will be rendered as an icon (submit button).
   * @default <Icon name="MagnifyingGlass" />
   */
  buttonIcon?: ReactNode
  /**
   * Custom aria-label for input and button.
   */
  'aria-label'?: AriaAttributes['aria-label']
  /**
   * Callback function when submitted.
   */
  onSubmit: (value: string) => void
}

export interface SearchInputFieldRef {
  inputRef?: HTMLInputElement | null
  formRef?: HTMLFormElement | null
}

const SearchInputField = forwardRef<
  SearchInputFieldRef | null,
  SearchInputFieldProps
>(function SearchInputField(
  {
    onSubmit,
    buttonIcon,
    'aria-label': ariaLabel = 'search',
    testId = 'fs-search-input',
    buttonProps,
    ...otherProps
  },
  ref
) {
  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (inputRef.current?.value !== '') {
      onSubmit(inputRef.current!.value)
    }
  }

  useImperativeHandle(ref, () => ({
    inputRef: inputRef.current,
    formRef: formRef.current,
  }))

  return (
    <form
      ref={formRef}
      data-fs-search-input-field
      data-testid={testId}
      onSubmit={handleSubmit}
      role="search"
    >
      <Input
        ref={inputRef}
        aria-label={ariaLabel}
        data-fs-search-input-field-input
        {...otherProps}
      />
      <IconButton
        type="submit"
        aria-label="Submit Search"
        icon={buttonIcon ?? <Icon name="MagnifyingGlass" />}
        size="small"
        {...buttonProps}
      />
    </form>
  )
})

export default SearchInputField
