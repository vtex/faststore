import type { Session } from '@vtex/faststore-sdk'
import { useUI } from '@vtex/faststore-ui'
import { useEffect, useState, type RefObject } from 'react'
import DiscoveryConfig from '../../../discovery.config'
import { getSavedAddress } from '../profile'
import { sessionStore } from '../session'

const set = (session: Session, data: Partial<Session>) => {
  if (!data || !Object.keys(data).length) return session

  return { ...session, ...data }
}

let userAddress: Partial<
  Pick<Session, 'city' | 'country' | 'geoCoordinates' | 'postalCode'>
> = undefined
const getUserSavedAddress = async (session: Session): Promise<Session> => {
  if (!!userAddress) return set(session, userAddress)
  const user = session?.person
  if (!user?.id) return Promise.resolve(session)

  const { city, country, geoCoordinate, postalCode } =
    (await getSavedAddress(user.id)) ?? {}

  userAddress = {
    city,
    country,
    geoCoordinates: {
      latitude: geoCoordinate?.[1] ?? null,
      longitude: geoCoordinate?.[0] ?? null,
    },
    postalCode,
  }

  return set(session, userAddress)
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
  >('closed')
  const { openModal, openPopover, modal: modalOpen, closePopover } = useUI()

  function getPopoverState(session: Session) {
    const isDefaultPostalCode =
      !!defaultSession.postalCode &&
      defaultSession.postalCode === session?.postalCode

    const newPopoverState =
      isDefaultPostalCode ||
      (!session?.postalCode && !deliveryPromise.mandatory)
        ? 'open'
        : 'closed'

    return newPopoverState
  }

  useEffect(() => {
    if (!deliveryPromise.enabled) return

    const handle = (session: Session) => {
      if (deliveryPromise.mandatory && !session?.postalCode && !modalOpen)
        return openModal()

      setRegionPopoverState((state) => {
        const newState = getPopoverState(session)
        return state !== newState ? newState : state
      })
    }

    return sessionStore.subscribe(handle)
  }, [modalOpen])

  useEffect(() => {
    if (regionPopoverState === 'closed') {
      closePopover()
      return
    }

    if (popoverRef) {
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
