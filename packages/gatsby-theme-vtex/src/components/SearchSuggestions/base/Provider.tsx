import React, { FC, useEffect, useMemo, useState } from 'react'
import { Flex } from '@vtex/store-ui'

import { debounce } from '../../../utils/debounce'
import { SearchSuggestionsContext } from './hooks'

interface Props {
  variant?: string
  debounceInterval?: number
}

export const SearchSuggestionsProvider: FC<Props> = ({
  children,
  debounceInterval = 150,
  variant = 'suggestions',
}) => {
  const [term, setTerm] = useState<string | null>(null)
  const setTermDebounced = useMemo(() => debounce(setTerm, debounceInterval), [
    debounceInterval,
  ])

  useEffect(() => {
    return () => setTermDebounced.clear()
  }, [setTermDebounced])

  return (
    <SearchSuggestionsContext.Provider
      value={{
        term,
        setTerm: setTermDebounced,
      }}
    >
      <Flex variant={variant}>{children}</Flex>
    </SearchSuggestionsContext.Provider>
  )
}
