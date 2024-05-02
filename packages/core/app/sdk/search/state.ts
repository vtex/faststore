import { useCallback } from 'react'
import { useRouter } from 'next/router'

export const useApplySearchState = () => {
  const router = useRouter()

  return useCallback(
    (url: URL) => router.push(`${url.pathname}${url.search}`),
    [router]
  )
}
