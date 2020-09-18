import React, { FC, useEffect, useMemo, useState } from 'react'
import { Flex } from '@vtex/store-ui'

import { debounce } from '../../../utils/debounce'
import { SearchSuggestionsContext } from './hooks'
import { useSearchBarContext } from '../../SearchBar/hooks'

interface Props {
  debounceInterval?: number
}

const SearchSuggestionsProvider: FC<Props> = ({
  children,
  debounceInterval = 150,
}) => {
  const searchbarContext = useSearchBarContext()
  const { term: searchbarTerm } = searchbarContext
  const [term, setTerm] = useState(searchbarTerm)
  const setTermDebounced = useMemo(() => debounce(setTerm, debounceInterval), [
    debounceInterval,
  ])

  useEffect(() => {
    setTerm(searchbarTerm)
  }, [searchbarTerm])

  useEffect(() => {
    return () => setTermDebounced.clear()
  }, [setTermDebounced])

  return (
    <SearchSuggestionsContext.Provider
      value={{
        term,
        setTerm: setTermDebounced,
        searchBar: searchbarContext,
      }}
    >
      <Flex variant="suggestions">{children}</Flex>
    </SearchSuggestionsContext.Provider>
  )
}

export default SearchSuggestionsProvider
