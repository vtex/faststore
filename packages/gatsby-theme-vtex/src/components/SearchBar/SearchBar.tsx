import React, { FC } from 'react'
import { PopoverInitialState } from '@vtex/store-ui'

import SearchBarButton from './Button'
import SearchBarInput from './Input'
import SearchSuggestions from '../SearchSuggestions'
import SearchBarProvider from './Provider'

export interface Props {
  variant?: string
  placeholder: string
  'aria-label': string
  popoverState?: PopoverInitialState
}

const SearchBar: FC<Props> = ({
  popoverState = { placement: 'bottom-start' },
  variant = 'searchbar',
  'aria-label': label,
  placeholder,
}) => (
  <SearchBarProvider>
    <SearchBarInput
      variant={variant}
      aria-label={label}
      placeholder={placeholder}
      popoverState={popoverState}
    >
      <SearchSuggestions />
    </SearchBarInput>
    <SearchBarButton variant={variant} aria-label={`${label} button`} />
  </SearchBarProvider>
)

export default SearchBar
