import type {
  AriaAttributes,
  FormEvent,
  InputHTMLAttributes,
  ReactNode
} from 'react'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'

import { Button, Icon, Input } from '@faststore/components'
import Form from '../Form'

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onSubmit'>

export interface SearchInputProps extends InputProps {
  /**
   * Callback function when submitted.
   */
  onSubmit: (value: string) => void
  /**
   * Custom icon inside the submit button.
   */
  icon?: ReactNode
  /**
   * Custom aria-label for input and button.
   */
  'aria-label'?: AriaAttributes['aria-label']
  /**
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
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
      testId = 'store-search-input',
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
      <Form
        ref={formRef}
        data-fs-search-input-form
        data-testid={testId}
        onSubmit={handleSubmit}
        role="search"
      >
        <Input ref={inputRef} aria-label={ariaLabel} {...otherProps} />
        <Button type="submit" aria-label="Submit Search">
          {React.isValidElement(icon) ? icon : <Icon name="MagnifyingGlass" />}
        </Button>
      </Form>
    )
  }
)

export default SearchInput
