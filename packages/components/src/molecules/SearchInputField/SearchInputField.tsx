import type {
  AriaAttributes,
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
} from 'react'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'

import { Icon, Button, Input, MagnifyingGlass } from '../..'

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
   * Custom icon inside the submit button.
   */
  icon?: ReactNode
  /**
   * Custom aria-label for input and button.
   */
  'aria-label'?: AriaAttributes['aria-label']
  /**
   * Callback function when submitted.
   */
  onSubmit: (value: string) => void
  /**
   * Props for the Button inside input.
   */
  buttonProps?: ButtonProps
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
    icon,
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
      data-fs-search-input-form
      data-testid={testId}
      onSubmit={handleSubmit}
      role="search"
    >
      <Input
        ref={inputRef}
        aria-label={ariaLabel}
        data-fs-search-input
        {...otherProps}
      />
      <Button type="submit" aria-label="Submit Search" {...buttonProps}>
        <Icon component={icon ?? <MagnifyingGlass />} />
      </Button>
    </form>
  )
})

export default SearchInputField
