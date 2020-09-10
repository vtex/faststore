import React, { FC } from 'react'
import { SearchBar as SearchBarContainer } from '@vtex/store-ui'

import SearchBarButton from './Button'
import SearchBarInput from './Input'

const loadController = () => import('../../sdk/search/controller')

interface Props {
  variant?: string
  placeholder: string
  'aria-label': string
}

const search = async (term: string) => {
  const controller = await loadController()

  controller.search(term)
}

const SearchBar: FC<Props> = ({
  variant = 'searchbar',
  placeholder,
  'aria-label': label,
}) => (
  <SearchBarContainer variant={variant}>
    <SearchBarInput
      variant={variant}
      onSearch={search}
      aria-label={`${label} input`}
      placeholder={placeholder}
    />
    <SearchBarButton
      variant={variant}
      onSearch={search}
      aria-label={`${label} button`}
    />
  </SearchBarContainer>
)

export default SearchBar
