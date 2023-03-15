import type {
  AriaAttributes,
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
} from 'react'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'

import { Icon, Button, Input, MagnifyingGlass } from '../../'

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onSubmit'>

export interface SearchInputProps extends InputProps {
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
}

export interface SearchInputRef {
  inputRef?: HTMLInputElement | null
  formRef?: HTMLFormElement | null
}

const SearchInput = forwardRef<SearchInputRef | null, SearchInputProps>(
  function SearchInput(
    {
      onSubmit,
      icon,
      'aria-label': ariaLabel = 'search',
      testId = 'fs-search-input',
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
        <Input ref={inputRef} aria-label={ariaLabel} {...otherProps} />
        <Button type="submit" aria-label="Submit Search">
          <Icon component={icon ?? <MagnifyingGlass />} />
        </Button>
      </form>
    )
  }
)

export default SearchInput
