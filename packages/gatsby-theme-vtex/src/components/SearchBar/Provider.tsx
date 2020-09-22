import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'

import { SearchBarContext } from './hooks'
import { debounce } from '../../utils/debounce'
import { search } from '../../sdk/search/controller'

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
