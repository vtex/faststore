import type { Session } from '@faststore/sdk'
import { getSavedAddress } from '../profile'
import DiscoveryConfig from 'discovery.config'
import { sessionStore } from '../session'
import { type RefObject, useEffect, useState } from 'react'
import { useUI } from '@faststore/ui'

const set = (session: Session, data: Partial<Session>) => {
  if (!data || !Object.keys(data).length) return session

  return { ...session, ...data }
}

let useAddress: Partial<
  Pick<Session, 'city' | 'country' | 'geoCoordinates' | 'postalCode'>
> = undefined
const getUserSavedAddress = async (session: Session): Promise<Session> => {
  if (!!useAddress) return set(session, useAddress)
  const user = session?.person
  if (!user?.id) return Promise.resolve(session)

  const { city, country, geoCoordinate, postalCode } =
    (await getSavedAddress(user.id)) ?? {}

  useAddress = {
    city,
    country,
    geoCoordinates: {
      latitude: geoCoordinate?.[1] ?? null,
      longitude: geoCoordinate?.[0] ?? null,
    },
    postalCode,
  }

  return set(session, useAddress)
}

let geoCoordinates: Session['geoCoordinates'] = undefined
export const getNavigatorGeolocation = (session: Session) => {
  return new Promise<Session>((res) => {
    if (!!geoCoordinates) return res(set(session, { geoCoordinates }))

    const successLocation: PositionCallback = ({
      coords: { latitude, longitude },
    }) => {
      geoCoordinates = { latitude, longitude }
      return res(set(session, { geoCoordinates }))
    }

    const onError: PositionErrorCallback = (err) => {
      console.warn('Failed to get navigator location: ', err)
      return res(session)
    }

    if (!!navigator && 'geolocation' in navigator) {
      const SECONDS = 1000,
        MINUTE = 60 * SECONDS

      return navigator.geolocation.getCurrentPosition(
        successLocation,
        onError,
        {
          timeout: 3 * MINUTE,
        }
      )
    }

    return session
  })
}

export const getPostalCode = async (session: Session) => {
  const sessionWithLoggedAddress = await getUserSavedAddress(session)

  if (sessionWithLoggedAddress !== session) return sessionWithLoggedAddress

  const defaultPostalCode: string | null =
    DiscoveryConfig.session?.postalCode ?? null

  return set(session, {
    postalCode: defaultPostalCode,
  })
}

const { deliveryPromise, session: defaultSession } = DiscoveryConfig

export const useCheckRegionState = (popoverRef?: RefObject<HTMLElement>) => {
  const [regionPopoverState, setRegionPopoverState] = useState<
    'open' | 'closed'
  >(getPopoverState(sessionStore.read()))
  const { openModal, openPopover, modal: modalOpen } = useUI()

  function getPopoverState(session: Session) {
    const isDefaultPostalCode =
      !!defaultSession.postalCode &&
      defaultSession.postalCode === session.postalCode

    const newPopoverState =
      isDefaultPostalCode || (!session.postalCode && !deliveryPromise.mandatory)
        ? 'open'
        : 'closed'

    return newPopoverState
  }

  useEffect(() => {
    if (!deliveryPromise.enabled) return

    const handle = (session: Session) => {
      if (deliveryPromise.mandatory && !session.postalCode && !modalOpen)
        return openModal()

      setRegionPopoverState((state) => {
        const newState = getPopoverState(session)
        return state !== newState ? newState : state
      })
    }

    return sessionStore.subscribe(handle)
  }, [modalOpen])

  useEffect(() => {
    if (popoverRef && regionPopoverState === 'open') {
      openPopover({
        isOpen: true,
        triggerRef: popoverRef,
      })
    }
  }, [popoverRef, regionPopoverState])

  return {
    openModal,
    openPopover,
    regionPopoverState,
  }
}
