import { Flex } from '@vtex/store-ui'
import React, { FC, useState } from 'react'

import { SearchBarContext } from './hooks'

interface Props {
  variant?: string
}

export const SearchBar: FC<Props> = ({ variant = 'searchbar', children }) => {
  const [term, setTerm] = useState('')

  return (
    <SearchBarContext.Provider value={{ term, setTerm }}>
      <Flex variant={`${variant}.container`}>{children}</Flex>
    </SearchBarContext.Provider>
  )
}
