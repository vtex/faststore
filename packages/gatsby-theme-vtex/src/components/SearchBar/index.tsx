import React, { FC } from 'react'

import SearchBarContainer from './Container'
import SearchBarComponent, { Props } from './SearchBar'

const SearchBar: FC<Props> = (props) => (
  <SearchBarContainer>
    <SearchBarComponent {...props} />
  </SearchBarContainer>
)

export default SearchBar
