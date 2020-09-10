import React, { FC } from 'react'
import { navigate } from '@reach/router'
import { SearchBar as SearchBarContainer, InputProps } from '@vtex/store-ui'

import SearchBarButton from './Button'
import SearchBarInput from './Input'

interface Props extends InputProps {
  variant?: string
}

const search = (term: string) => navigate(`/${encodeURIComponent(term)}`)

const SearchBar: FC<Props> = ({ variant = 'searchbar', ...forward }) => (
  <SearchBarContainer variant={variant}>
    <SearchBarInput variant={variant} onSearch={search} {...forward} />
    <SearchBarButton variant={variant} onSearch={search} />
  </SearchBarContainer>
)

export default SearchBar
