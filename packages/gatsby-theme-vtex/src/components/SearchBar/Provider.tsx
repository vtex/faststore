import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Flex } from '@vtex/store-ui'

import { SearchBarContext } from './hooks'
import { debounce } from '../../utils/debounce'

const loadController = () => import('../../sdk/search/controller')

interface Props {
  variant?: string
  debounceInterval?: number
}

const onSearch = async (term: string) => {
  const controller = await loadController()

  controller.search(term)
}

const SearchBarProvider: FC<Props> = ({
  variant = 'searchbar',
  children,
  debounceInterval = 300,
}) => {
  const [syncTerm, setSyncTerm] = useState<string>('')
  const [asyncTerm, setAsyncTerm] = useState<string>(syncTerm)
  const setTermDebounced = useMemo(
    () => debounce(setAsyncTerm, debounceInterval),
    [debounceInterval]
  )

  const setTerm = useCallback(
    (term: string) => {
      setSyncTerm(term)
      setTermDebounced(term)
    },
    [setTermDebounced]
  )

  useEffect(() => {
    return () => setTermDebounced.clear()
  }, [setTermDebounced])

  return (
    <SearchBarContext.Provider
      value={{
        syncTerm,
        asyncTerm,
        setTerm,
        onSearch,
      }}
    >
      <Flex variant={`${variant}.container`}>{children}</Flex>
    </SearchBarContext.Provider>
  )
}

export default SearchBarProvider
