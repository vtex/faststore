import { debounce } from '@vtex/store-ui'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { FC } from 'react'

import { search } from '../../sdk/search/controller'
import { SearchBarContext } from './hooks'

interface Props {
  debounceInterval?: number
}

const SearchBarProvider: FC<Props> = ({ children, debounceInterval = 250 }) => {
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
        onSearch: search,
      }}
    >
      {children}
    </SearchBarContext.Provider>
  )
}

export default SearchBarProvider
