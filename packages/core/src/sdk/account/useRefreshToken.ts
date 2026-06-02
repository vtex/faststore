import { useEffect, useState } from 'react'
import { isLocalHostBrowser } from 'src/utils/isLocalHost'
import { logoutAndClearSession, sessionStore } from '../session'
import { isRefreshTokenSuccessful, refreshTokenRequest } from './refreshToken'

export const useRefreshToken = (
  needsRefreshToken?: boolean,
  fromPage?: string
) => {
  const [shouldShow403, setShouldShow403] = useState(false)

  useEffect(() => {
    const handleRefreshTokenAndUpdateSession = async () => {
      if (!needsRefreshToken) return

      // The refresh-token endpoint lives on the production origin and relies on
      // the `vid_rt` cookie scoped to that origin. From localhost the request is
      // cross-origin, so the cookie is not sent and the refresh always fails —
      // which would also wipe the manually injected `VtexIdclientAutCookie_<account>`
      // via `logoutAndClearSession`. Bail out and fall back to the static 403
      // view so developers can keep testing logged-in flows.
      if (isLocalHostBrowser()) {
        setShouldShow403(true)
        return
      }

      const currentSession = sessionStore.read() ?? sessionStore.readInitial()

      try {
        const result = await refreshTokenRequest()

        if (isRefreshTokenSuccessful(result)) {
          // Update session with new refreshAfter timestamp
          const refreshAfter = String(
            Math.floor(new Date(result?.refreshAfter).getTime() / 1000)
          )

          sessionStore.set({
            ...currentSession,
            refreshAfter,
          })

          // Refresh token successful, go back to the page that called 403
          // Forces complete navigation through getServerSideProps by adding a cache-busting parameter
          const previousPage = fromPage || '/pvt/account'

          // Add timestamp to force server-side navigation and avoid browser cache
          const url = new URL(previousPage, window.location.origin)
          url.searchParams.set('_refresh', Date.now().toString())
          window.location.href = url.toString()
        } else {
          await logoutAndClearSession(currentSession)
          setShouldShow403(true)
        }
      } catch (error) {
        console.error('Error during refresh token process:', error)
        await logoutAndClearSession(currentSession)
        setShouldShow403(true)
      }
    }

    handleRefreshTokenAndUpdateSession()
  }, [needsRefreshToken, fromPage])

  return {
    shouldShow403,
  }
}
