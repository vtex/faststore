import { useCallback } from 'react'

export const useApplySearchState = () => {
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
