import { useEffect } from 'react'

import { deliveryPromise } from 'discovery.config'
import { validateSession, sessionStore } from 'src/sdk/session'

const TIME_TO_VALIDATE_SESSION = 3000

async function askGeolocationConsent() {
  const { postalCode: stalePostalCode, geoCoordinates: staleGeoCoordinates } =
    sessionStore.read()

  if (navigator?.geolocation && (!stalePostalCode || !staleGeoCoordinates)) {
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        // Revalidate the session because users can set a zip code while granting consent.
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
}

export default function useGeolocation() {
  useEffect(() => {
    if (!deliveryPromise.enabled) {
      return
    }

    setTimeout(() => askGeolocationConsent(), TIME_TO_VALIDATE_SESSION)
  }, [])
}
