import type {
  ChangeEvent,
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
} from 'react'
import React, { forwardRef, useState } from 'react'

import Button from '../../atoms/Button'
import Icon from '../../atoms/Icon'
import Input from '../../atoms/Input'

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
  onSubmit: (value: string) => void
  icon?: ReactNode
  testId?: string
}

const SearchInput = forwardRef<HTMLFormElement, SearchInputProps>(
  function SearchInput(
    { onSubmit, icon, testId = 'store-search-input', ...props },
    ref
  ) {
    const [search, setSearch] = useState<string>('')

    const handleSubmit = (event: FormEvent) => {
      event.preventDefault()

      if (search !== '') {
        onSubmit(search)
      }
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value)
    }

    return (
      <form
        ref={ref}
        data-store-search-input
        data-testid={testId}
        onSubmit={handleSubmit}
      >
        <Input name="search" onChange={handleChange} {...props} />
        <Button type="submit">
          <Icon component={icon ?? <SearchIcon />} />
        </Button>
      </form>
    )
  }
)

export default SearchInput
