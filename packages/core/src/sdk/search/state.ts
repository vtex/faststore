import { useCallback } from 'react'

import { useLink } from 'src/sdk/ui/useLink'

export const useApplySearchState = () => {
  const { resolveLink } = useLink()

  return useCallback(
    (url: URL) => {
      const newUrl = `${url.pathname}${url.search}`
      // Resolve so locale/custom path is preserved (global state may have base '/s' from an earlier route)
      const resolved = resolveLink(newUrl) ?? newUrl

      // saves state on URL without triggering a re-render.
      window.history.replaceState(
        {
          ...window.history.state,
          as: resolved,
          url: resolved,
        },
        '',
        resolved
      )
    },
    [resolveLink]
  )
}
