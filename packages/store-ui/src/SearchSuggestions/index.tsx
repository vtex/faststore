import React, { FC, useState } from 'react'
import { Flex } from 'theme-ui'

import { SearchSuggestionsContext } from './hooks'

interface Props {
  variant?: string
}

export const SearchSuggestions: FC<Props> = ({
  children,
  variant = 'suggestions',
}) => {
  const [term, setTerm] = useState<string | null>(null)

  return (
    <SearchSuggestionsContext.Provider
      value={{
        term,
        setTerm,
      }}
    >
      <Flex variant={variant}>{children}</Flex>
    </SearchSuggestionsContext.Provider>
  )
}
