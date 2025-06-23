import { useCallback } from 'react'
import { useRouter } from 'next/router'

export const useApplySearchState = () => {
  const router = useRouter()

  return useCallback((url: URL) => {
    const newUrl = `${url.pathname}${url.search}`

    // saves state on URL without triggering a re-render.
    window.history.replaceState(
      {
        ...window.history.state,
        as: newUrl,
        url: newUrl,
      },
      '',
      newUrl
    )
  }, [])
}
