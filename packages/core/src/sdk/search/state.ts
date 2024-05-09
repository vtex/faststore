import { useCallback } from 'react'
import { useRouter } from 'next/router'

export const useApplySearchState = () => {
  const router = useRouter()

  return useCallback(
    (url: URL) => {
      if (url.searchParams.has('fuzzy') && url.searchParams.has('operator')) {
        const newUrl = [url.pathname, url.searchParams]
          .filter(Boolean)
          .join('?')

        window.history.replaceState(window.history.state, '', newUrl)
        return
      }

      return router.push(`${url.pathname}${url.search}`)
    },
    [router]
  )
}
