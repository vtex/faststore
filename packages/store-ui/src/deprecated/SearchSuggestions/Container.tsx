import React from 'react'
import { Flex } from 'theme-ui'
import type { FC } from 'react'

const SearchSuggestionsContainer: FC = ({ children }) => (
  <Flex variant="suggestions">{children}</Flex>
)

export default SearchSuggestionsContainer
