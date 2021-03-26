import { useMemo } from 'react'
import { navigate } from 'gatsby'
import { useLocation } from '@reach/router'

export const setSearchParams = (
  search: URLSearchParams,
  options?: {
    state?: any
    replace?: boolean
  }
) => navigate(`?${search.toString()}`, options)

export const useSearchParams = (): [
  URLSearchParams,
  typeof setSearchParams
] => {
  const { search } = useLocation()
  const searchParams = useMemo(() => new URLSearchParams(search), [search])

  return [searchParams, setSearchParams]
}
