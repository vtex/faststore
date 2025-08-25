import { useEffect } from 'react'

import { deliveryPromise } from 'discovery.config'
import { TIME_TO_VALIDATE_SESSION } from 'src/constants'
import { sessionStore, validateSession } from 'src/sdk/session'
import { getNavigatorGeolocation } from '../userLocation'

export default function useGeolocation() {
  useEffect(() => {
    if (!deliveryPromise.enabled) {
      return
    }

    setTimeout(() => {
      let session = sessionStore.read()

      if (!session.postalCode || !session.geoCoordinates) {
        getNavigatorGeolocation(session).then(async (newSession) => {
          if (session === newSession) return

          // checks if someone already filled the location data
          session = sessionStore.read()
          if (session.postalCode || session.geoCoordinates) {
            return
          }
          const validatedSession = await validateSession(newSession)
          sessionStore.set(validatedSession ?? newSession)
        })
      }
    }, TIME_TO_VALIDATE_SESSION)
  }, [])
}
