import { useMemo } from 'react'

import { isServer } from '../../utils/env'

export const setSearchParams = (qs: string) => {
  window.location.search =
    window.location.search.length === 0
      ? `?${qs}`
      : `${window.location.search}&${qs}`
}

export const useSearchParams = (): [
  URLSearchParams,
  typeof setSearchParams
] => {
  const search = !isServer ? window.location.search : ''
  const searchParams = useMemo(() => new URLSearchParams(search), [search])

  return [searchParams, setSearchParams]
}
