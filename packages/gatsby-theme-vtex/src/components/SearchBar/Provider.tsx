import React, { FC, useState } from 'react'
import { Flex } from '@vtex/store-ui'

import { SearchBarContext } from './hooks'

const loadController = () => import('../../sdk/search/controller')

interface Props {
  variant?: string
}

const onSearch = async (term: string) => {
  const controller = await loadController()

  controller.search(term)
}

const SearchBarProvider: FC<Props> = ({ variant = 'searchbar', children }) => {
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

export default SearchBarProvider
