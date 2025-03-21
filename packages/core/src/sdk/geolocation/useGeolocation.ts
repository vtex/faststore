import { useEffect } from 'react'

import { deliveryPromise } from 'discovery.config'
import { useSession, validateSession, sessionStore } from 'src/sdk/session'

export default function useGeolocation() {
  const { isValidating: _, ...session } = useSession()

  useEffect(() => {
    if (!deliveryPromise.enabled) {
      return
    }

    if (navigator?.geolocation && !session.geoCoordinates) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords: { latitude, longitude } }) => {
          const newSession = {
            ...session,
            geoCoordinates: { latitude, longitude },
          }
          const validatedSession = await validateSession(newSession)
          sessionStore.set(validatedSession ?? newSession)
        }
      )
    }
  }, [])
}
