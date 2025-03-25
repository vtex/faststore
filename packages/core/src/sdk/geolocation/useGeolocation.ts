import { useEffect } from 'react'

import { deliveryPromise } from 'discovery.config'
import { useSession, validateSession, sessionStore } from 'src/sdk/session'

export default function useGeolocation() {
  const { geoCoordinates: staleGeoCoordinates } = useSession()

  useEffect(() => {
    if (!deliveryPromise.enabled) {
      return
    }

    if (navigator?.geolocation && !staleGeoCoordinates) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords: { latitude, longitude } }) => {
          // We need to revalidate the session because users can set a zip code while granting consent.
          const revalidatedSession = sessionStore.read()
          if (
            revalidatedSession.postalCode ||
            revalidatedSession.geoCoordinates
          ) {
            return
          }

          const newSession = {
            ...revalidatedSession,
            geoCoordinates: { latitude, longitude },
          }
          const validatedSession = await validateSession(newSession)
          sessionStore.set(validatedSession ?? newSession)
        }
      )
    }
  }, [])
}
