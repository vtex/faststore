import React, { FC } from 'react'
import { SearchBar as SearchBarContainer, InputProps } from '@vtex/store-ui'

import SearchBarButton from './Button'
import SearchBarInput from './Input'

const loadController = () => import('../../sdk/search/controller')

interface Props extends InputProps {
  variant?: string
}

const search = async (term: string) => {
  const controller = await loadController()

  controller.search(term)
}

const SearchBar: FC<Props> = ({ variant = 'searchbar', ...forward }) => (
  <SearchBarContainer variant={variant}>
    <SearchBarInput variant={variant} onSearch={search} {...forward} />
    <SearchBarButton variant={variant} onSearch={search} />
  </SearchBarContainer>
)

export default SearchBar
