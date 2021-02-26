import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { FC } from 'react'

import debounce from '../utils/debounce'
import { SearchBarContext } from './hooks'

interface Props {
  debounceInterval?: number
  onSearch: (term: string) => unknown
}

const SearchBarProvider: FC<Props> = ({
  children,
  debounceInterval = 250,
  onSearch,
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
      {children}
    </SearchBarContext.Provider>
  )
}

export default SearchBarProvider
