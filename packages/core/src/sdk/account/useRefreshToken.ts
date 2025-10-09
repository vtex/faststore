import { useEffect, useState } from 'react'
import { sessionStore } from '../session'
import { isRefreshTokenSuccessful, refreshTokenRequest } from './refreshToken'

export const useRefreshToken = (
  needsRefreshToken?: boolean,
  fromPage?: string
) => {
  const [shouldShow403, setShouldShow403] = useState(false)

  useEffect(() => {
    const handleRefreshTokenAndUpdateSession = async () => {
      if (!needsRefreshToken) return

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
          // If refresh token failed, set refreshAfter to now + 1 hour
          sessionStore.set({
            ...currentSession,
            refreshAfter: String(Math.floor(Date.now() / 1000) + 1 * 60 * 60), // now + 1 hour
          })

          setShouldShow403(true)
        }
      } catch (error) {
        console.error('Error during refresh token process:', error)

        // Set refreshAfter to postpone future requests and redirect to login
        sessionStore.set({
          ...currentSession,
          refreshAfter: String(Math.floor(Date.now() / 1000) + 1 * 60 * 60), // now + 1 hour
        })

        setShouldShow403(true)
      }
    }

    handleRefreshTokenAndUpdateSession()
  }, [needsRefreshToken, fromPage])

  return {
    shouldShow403,
  }
}
