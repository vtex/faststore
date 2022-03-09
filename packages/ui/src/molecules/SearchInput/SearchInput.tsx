import type {
  AriaAttributes,
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
} from 'react'
import React, { useImperativeHandle, forwardRef, useRef } from 'react'

import Button from '../../atoms/Button'
import Icon from '../../atoms/Icon'
import Input from '../../atoms/Input'
import Form from '../Form'

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

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
        data-store-search-input
        data-testid={testId}
        onSubmit={handleSubmit}
        role="search"
      >
        <Input ref={inputRef} aria-label={ariaLabel} {...otherProps} />
        <Button type="submit" aria-label="Submit Search">
          <Icon component={icon ?? <SearchIcon />} />
        </Button>
      </Form>
    )
  }
)

export default SearchInput
