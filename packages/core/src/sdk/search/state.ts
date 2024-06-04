import { useCallback } from 'react'
import { useRouter } from 'next/router'

export const useApplySearchState = () => {
  const router = useRouter()

  return useCallback(
    (url: URL) => {
      const currentUrl = new URL(window.location.href)
      const newUrl = `${url.pathname}${url.search}`
      if (currentUrl.href !== newUrl) {
        if (url.searchParams.has('fuzzy') && url.searchParams.has('operator')) {
          window.history.replaceState({}, '', newUrl)
        } else {
          router.push(newUrl)
        }
      }
    },
    [router]
  )
}
