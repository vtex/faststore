import React, { FC } from 'react'

import SearchBarButton from './Button'
import SearchBarInput from './Input'
import SearchSuggestions from '../SearchSuggestions'
import SearchBarProvider from './Provider'

interface Props {
  variant?: string
  placeholder: string
  'aria-label': string
}

const SearchBar: FC<Props> = ({
  variant = 'searchbar',
  placeholder,
  'aria-label': label,
}) => (
  <SearchBarProvider variant={variant}>
    <SearchBarInput
      variant={variant}
      aria-label={`${label} input`}
      placeholder={placeholder}
    >
      <SearchSuggestions />
    </SearchBarInput>
    <SearchBarButton variant={variant} aria-label={`${label} button`} />
  </SearchBarProvider>
)

export default SearchBar
