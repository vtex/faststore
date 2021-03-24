import React, { useEffect, useState } from 'react'
import type { FC } from 'react'
import { Flex, useSearchBarContext } from '@vtex/store-ui'

import { SearchSuggestionsContext } from './hooks'

interface Props {
  debounceInterval?: number
}

const SearchSuggestionsProvider: FC<Props> = ({ children }) => {
  const searchbarContext = useSearchBarContext()
  const searchbarTerm = searchbarContext.asyncTerm
  const [term, setTerm] = useState(searchbarTerm)

  useEffect(() => {
    setTerm(searchbarTerm)
  }, [searchbarTerm])

  return (
    <SearchSuggestionsContext.Provider
      value={{
        term,
        setTerm,
        searchBar: searchbarContext,
      }}
    >
      <Flex variant="suggestions">{children}</Flex>
    </SearchSuggestionsContext.Provider>
  )
}

export default SearchSuggestionsProvider
