import React, { FC, useState } from 'react'
import { Flex } from 'theme-ui'

import { SearchBarContext } from './hooks'

interface Props {
  variant?: string
  onSearch: (term: string) => unknown
}

export const SearchBar: FC<Props> = ({
  variant = 'searchbar',
  children,
  onSearch,
}) => {
  const [term, setTerm] = useState<string | null>(null)

  return (
    <SearchBarContext.Provider
      value={{
        term,
        setTerm,
        onSearch,
      }}
    >
      <Flex variant={`${variant}.container`}>{children}</Flex>
    </SearchBarContext.Provider>
  )
}
