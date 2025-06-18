import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { useGlobalStateSearch as useSearch } from '@faststore/sdk'

export const useApplySearchState = () => {
  const { state: searchState } = useSearch()
  const router = useRouter()
  const previousRoute = useRef(searchState.serializedState())

  /**
   * In case the user navigates twice to the same route
   * the event should place the searchState to the queryStrings in case its not already.
   */
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (
        previousRoute.current.href === searchState.serializedState().href &&
        previousRoute.current.href.replace(/^http:\/\/localhost/, '') !== url
      ) {
        const newUrl = `${previousRoute.current.pathname}${previousRoute.current.search}`
        router.replace(newUrl, null, { shallow: true })
      }
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [])

  /**
   * In case the search state changes, this useEffect should place the state on the URL.
   */
  useEffect(() => {
    if (previousRoute.current.href !== searchState.serializedState().href) {
      const url = searchState.serializedState()
      const newUrl = `${url.pathname}${url.search}`
      url.searchParams.has('fuzzy') && url.searchParams.has('operator')
        ? router.replace(newUrl, null, { shallow: true })
        : router.push(newUrl, null, { shallow: true })
    }
  }, [searchState])
}
