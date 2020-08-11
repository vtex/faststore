import { useLocation } from '@reach/router'
import { useMemo } from 'react'

export const useLocationSearch = () => {
  const location = useLocation()
  const { search } = location
  const params = useMemo(() => new URLSearchParams(search), [search])

  return {
    ...location,
    params,
  }
}
