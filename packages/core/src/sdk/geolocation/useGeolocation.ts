import { useEffect, useState } from 'react'

import {
  deliveryPromise,
  session as defaultSessionValues,
} from 'discovery.config'
import { sessionStore, validateSession } from 'src/sdk/session'
import { createStore, type Session } from '@faststore/sdk'
import { useUI } from '@faststore/ui'
import { getSavedAddress } from '../profile'

const SECONDS = 1000
const MINUTE = 60 * SECONDS

export const geolocationStore = createStore<{
  popupState: 'closed' | 'open'
}>({
  popupState: 'closed',
})

export default function useGeolocation() {
  const { openModal, closeModal } = useUI()
  const [sessionReady, setSessionInitialized] = useState(false)

  useEffect(() => {
    return sessionStore.subscribe((val) => setSessionInitialized(val.ready))
  }, [])

  useEffect(() => {
    if (!deliveryPromise.enabled || !sessionReady) {
      return
    }
    // async execution to use await
    ;(async () => {
      const sessionData = sessionStore.read()
      const { postalCode, geoCoordinates, person } = sessionData

      // always check user saved address and use it.
      if (person?.id) {
        await getUserSavedAddress(person.id)
        const { latitude, longitude } = sessionStore.read().geoCoordinates
        if (latitude && longitude) return
      }

      if (postalCode || geoCoordinates) {
        await validateSession(sessionData)
        return
      }

      if (deliveryPromise.mandatory) {
        openModal() //opens the modal
        askGeolocationConsent({ postalCode, geoCoordinates }, () => {
          const { latitude, longitude } = sessionStore.read().geoCoordinates
          if (latitude && longitude) closeModal()
        })
        return
      }

      // As the popup need a ref to anchor it must be done by the componente where the anchor will happen.
      geolocationStore.set({ popupState: 'open' })

      if (defaultSessionValues.postalCode) {
        // sets default postal code to session
        sessionStore.set({
          ...sessionStore.read(),
          postalCode: defaultSessionValues.postalCode,
        })
      }

      askGeolocationConsent({ postalCode, geoCoordinates })
    })()
  }, [sessionReady])

  async function updateSessionGeolocation([latitude, longitude]: [
    number,
    number,
  ]) {
    const newSession = {
      ...sessionStore.read(),
      geoCoordinates: { latitude, longitude },
    }
    const validatedSession = await validateSession(newSession)
    sessionStore.set(validatedSession ?? newSession)
  }

  async function updateSessionUserAddress(
    address: Partial<
      Pick<Session, 'city' | 'postalCode' | 'geoCoordinates' | 'country'>
    >
  ) {
    sessionStore.set({
      ...sessionStore.read(),
      ...address,
    })
  }

  async function getUserSavedAddress(personId: string) {
    console.assert(!!personId, 'Missing personId value')

    const address = await getSavedAddress(personId)

    // Save the location in the session
    if (address) {
      await updateSessionUserAddress({
        ...address,
        geoCoordinates: {
          latitude: address?.geoCoordinate?.[1] ?? null,
          longitude: address?.geoCoordinate?.[0] ?? null,
        },
      })
    }
  }

  async function askGeolocationConsent(
    {
      postalCode: stalePostalCode,
      geoCoordinates: staleGeoCoordinates,
    }: Pick<Session, 'postalCode' | 'geoCoordinates'>,
    callback?: () => void
  ) {
    const successLocation: PositionCallback = async ({
      coords: { latitude, longitude },
    }) => {
      // Revalidate the session because users can set a zip code while granting consent.
      const revalidatedSession = sessionStore.read()
      if (revalidatedSession.postalCode || revalidatedSession.geoCoordinates) {
        return
      }

      await updateSessionGeolocation([latitude, longitude])
      callback?.()
    }

    const onError: PositionErrorCallback = (err) => {
      console.error("Couldn't get the current position.\n Error: %O", err)
    }
    if (navigator?.geolocation && (!stalePostalCode || !staleGeoCoordinates)) {
      navigator.geolocation.getCurrentPosition(successLocation, onError, {
        timeout: 3 * MINUTE,
      })
    }
  }
}
