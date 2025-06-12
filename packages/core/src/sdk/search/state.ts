import { useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { useSearch } from '@faststore/sdk'

export const useApplySearchState = () => {
  const { state: searchState } = useSearch()
  const router = useRouter()
  const previousRoute = useRef(searchState.serializedState())

  useEffect(() => {
    if (previousRoute.current.href !== searchState.serializedState().href) {
      const url = searchState.serializedState()
      const newUrl = `${url.pathname}${url.search}`
      url.searchParams.has('fuzzy') && url.searchParams.has('operator')
        ? router.replace(newUrl)
        : router.push(newUrl)
    }
  }, [searchState])
}
