import React, { FC, useMemo, useState } from 'react'
import { Flex } from 'theme-ui'

import { debounce } from '../utils/debounce'
import { SearchBarContext } from './hooks'

interface Props {
  variant?: string
  debounceInterval?: number
  onSearch: (term: string) => unknown
}

export const SearchBar: FC<Props> = ({
  variant = 'searchbar',
  children,
  onSearch,
  debounceInterval = 400,
}) => {
  const [term, setTerm] = useState<string | null>(null)
  const setTermDebounced = useMemo(() => debounce(setTerm, debounceInterval), [
    debounceInterval,
  ])

  return (
    <SearchBarContext.Provider
      value={{
        term,
        setTerm: setTermDebounced,
        onSearch,
      }}
    >
      <Flex variant={`${variant}.container`}>{children}</Flex>
    </SearchBarContext.Provider>
  )
}
