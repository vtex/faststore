import type { Session } from '@faststore/sdk'
import { createSessionStore } from '@faststore/sdk'
import fetch from 'isomorphic-unfetch'
import { useMemo } from 'react'

import { gql } from '@generated'
import type {
  ValidateSessionMutation,
  ValidateSessionMutationVariables,
} from '@generated/graphql'
import discoveryConfig from 'discovery.config'
import deepEqual from 'fast-deep-equal'
import { sanitizeHost } from 'src/utils/utilities'
import storeConfig from '../../../discovery.config'
import { cartStore } from '../cart'
import { request } from '../graphql/request'
import { createValidationStore, useStore } from '../useStore'
import { getPostalCode } from '../userLocation/index'

const REFRESH_TOKEN_URL = `${discoveryConfig.storeUrl}/api/vtexid/refreshtoken/webstore`

export const mutation = gql(`
  mutation ValidateSession($session: IStoreSession!, $search: String!) {
    validateSession(session: $session, search: $search) {
      locale
      channel
      country
      addressType
      postalCode
      city
      deliveryMode {
        deliveryChannel
        deliveryMethod
        deliveryWindow {
          startDate
          endDate
        }
      }
      geoCoordinates {
        latitude
        longitude
      }
      currency {
        code
        symbol
      }
      person {
        id
        email
        givenName
        familyName
      }
      b2b {
        customerId
        isRepresentative
        unitName
        unitId
        firstName
        lastName
        userName
        userEmail
        savedPostalCode
        contractName
      }
      marketingData {
        utmCampaign
        utmMedium
        utmSource
        utmiCampaign
        utmiPage
        utmiPart
      }
      refreshAfter
    }
  }
`)

export const validateSession = async (session: Session) => {
  // If deliveryPromise is enabled and there is no postalCode in the session
  if (
    storeConfig.deliveryPromise?.enabled &&
    (!session.postalCode ||
      session.postalCode === storeConfig.session.postalCode)
  ) {
    // Case B2B: If a B2B shopper is logged in and a saved address is available, the postalCode field is automatically updated with the postal code from that address by the B2B session apps (shopper-session and profile-session).
    if (session.b2b && session.b2b?.savedPostalCode) {
      sessionStore.set({
        ...session,
        postalCode: session.b2b.savedPostalCode,
      })
    } else {
      const sessionWithLocation = await getPostalCode(session)
      !!sessionWithLocation && sessionStore.set(sessionWithLocation)
    }
  }

  try {
    // Prevents to call ValidateSession without session (required) and get Error
    if (!session) {
      return null
    }

    const data = await request<
      ValidateSessionMutation,
      ValidateSessionMutationVariables
    >(mutation, { session, search: window.location.search })

    return data.validateSession
  } catch (error) {
    const shouldRefreshToken =
      error?.status === 401 && storeConfig.experimental?.refreshToken

    if (shouldRefreshToken) {
      const headers: HeadersInit = {
        'content-type': 'application/json',
        Host: `${sanitizeHost(discoveryConfig.storeUrl)}`,
      }

      const result = await fetchWithRetry(REFRESH_TOKEN_URL, {
        credentials: 'include',
        headers,
        body: JSON.stringify({}),
        method: 'POST',
      })

      if (result?.status?.toLowerCase?.() === 'success') {
        const refreshAfter = String(
          Math.floor(new Date(result?.refreshAfter).getTime() / 1000)
        )

        sessionStore.set({
          ...session,
          refreshAfter,
        })
      } else {
        // If the refresh token fails 3x, set the refreshAfter to now + 1 hour
        // so that we can postpone refreshToken request and continue the ValidateSession request
        sessionStore.set({
          ...session,
          refreshAfter: String(Math.floor(Date.now() / 1000) + 1 * 60 * 60), // now + 1 hour
        })
      }
    }
  }
}

const [validationStore, onValidate] = createValidationStore(validateSession)

const defaultStore = createSessionStore(storeConfig.session, onValidate)

export const sessionStore = {
  ...defaultStore,
  set: (val: Session) => {
    if (deepEqual(val, defaultStore.read()) === true) return

    defaultStore.set(val)

    // Trigger cart revalidation when session changes
    cartStore.set(cartStore.read())
  },
}

interface SessionOptions {
  filter?: boolean
}

/**
 * This custom hook is used to retrieve the session data and filter the channel object.
 * The channel object filtering removes the hasOnlyDefaultSalesChannel key.
 * This key is used only in the useAuth hook and is only required to send on the ValidateSession mutation,
 * so we remove it from the session's channel object to avoid unnecessary cache invalidations and query executions.
 *
 * @param options - Optional configuration for the hook.
 * @param options.filter - A boolean value indicating whether to filter the channel object or not. Default is true.
 * @returns An object containing the session data, channel object, and a flag indicating whether the session is being validated.
 */

export const useSession = ({ filter }: SessionOptions = { filter: true }) => {
  const currentSessionStore = sessionStore.read() ?? sessionStore.readInitial()
  const resultSessionStore = useStore(sessionStore)
  const isValidating = useStore(validationStore)
  let { channel, ...session } = resultSessionStore ?? currentSessionStore

  if (filter) {
    const { hasOnlyDefaultSalesChannel, ...filteredChannel } =
      JSON.parse(channel)
    channel = JSON.stringify(filteredChannel)
  }

  return useMemo(
    () => ({
      ...session,
      channel,
      isValidating,
    }),
    [isValidating, session, channel]
  )
}

async function fetchWithRetry(
  url: RequestInfo | URL,
  init?: RequestInit,
  maxRetries = 3
) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url, init)
      if (res.status !== 200) continue

      const data = await res.json()
      if (data.status?.toLowerCase?.() === 'success') {
        return data
      }
    } catch {}
  }

  return
}
