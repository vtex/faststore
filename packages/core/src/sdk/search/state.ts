import { useCallback } from 'react'
import { useRouter } from 'next/router'

export const useApplySearchState = () => {
  const router = useRouter()

  return useCallback(
    (url: URL) => {
      const newUrl = `${url.pathname}${url.search}`
      return url.searchParams.has('fuzzy') && url.searchParams.has('operator')
        ? router.replace(newUrl)
        : router.push(newUrl)
    },
    [router]
  )
}
