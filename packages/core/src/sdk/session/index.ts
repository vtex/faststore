import type { Session } from '@faststore/sdk'
import { createSessionStore } from '@faststore/sdk'
import { useEffect, useMemo, useState } from 'react'

import { gql } from '@generated'
import type {
  ValidateSessionMutation,
  ValidateSessionMutationVariables,
} from '@generated/graphql'
import deepEqual from 'fast-deep-equal'
import { filterChannel } from 'src/utils/utilities'
import storeConfig from '../../../discovery.config'
import {
  isRefreshTokenSuccessful,
  refreshTokenRequest,
} from '../account/refreshToken'
import { cartStore } from '../cart'
import { request } from '../graphql/request'
import { getSettings } from '../localization/useLocalizationConfig'
import { createValidationStore, useStore } from '../useStore'
import { getPostalCode } from '../userLocation/index'
import { RELOAD_AFTER_LOGOUT_KEY, SESSION_READY_KEY } from './storageKeys'

const isLocalEnvironment = (): boolean =>
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1')

const isReloadAfterLogoutPending = (): boolean => {
  try {
    return (
      typeof sessionStorage !== 'undefined' &&
      !!sessionStorage.getItem(RELOAD_AFTER_LOGOUT_KEY)
    )
  } catch {
    return false
  }
}

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
        organizationManager
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

async function handleRefreshToken(session: Session): Promise<Session | null> {
  const result = await refreshTokenRequest()

  if (isRefreshTokenSuccessful(result)) {
    return {
      ...session,
      refreshAfter: String(
        Math.floor(new Date(result?.refreshAfter).getTime() / 1000)
      ),
    }
  }

  await logoutAndClearSession(session)
  return null
}

function isRefreshAfterExpired(session: Session): boolean {
  return (
    !!session.refreshAfter &&
    Math.floor(Date.now() / 1000) > Number(session.refreshAfter)
  )
}

export const validateSession = async (session: Session) => {
  // Skip validation if the page is about to reload after logout — avoids an
  // aborted-fetch TypeError when the forced reload navigates the page away.
  if (isReloadAfterLogoutPending()) {
    return null
  }

  // If the refreshToken is enabled and the refreshAfter is expired, refresh the token.
  // On success, continue to the validation flow with the refreshed session.
  // On failure (logoutAndClearSession already triggered), bail out.
  // Skipped in local environments where the refresh token infrastructure is unavailable.
  if (
    !isLocalEnvironment() &&
    storeConfig.experimental?.refreshToken &&
    isRefreshAfterExpired(session)
  ) {
    const refreshed = await handleRefreshToken(session)
    if (!refreshed) {
      return null
    }
    session = refreshed
  }

  const settings = getSettings()
  const newChanel = JSON.stringify({
    ...(JSON.parse(session.channel ?? '{}') ?? {}),
    salesChannel: settings.salesChannel,
  })

  if (
    newChanel !== session.channel ||
    settings.locale !== session.locale ||
    deepEqual(settings.currency, session.currency) === false
  ) {
    session.locale = settings.locale
    session.currency = settings.currency
    session.channel = newChanel
  }

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

    // Remove fields that are not part of IStoreSession type
    const { isSessionReady, isValidating, ...sessionWithoutExtras } =
      session as Session & {
        isSessionReady?: boolean
        isValidating?: boolean
      }

    const data = await request<
      ValidateSessionMutation,
      ValidateSessionMutationVariables
    >(mutation, {
      session: sessionWithoutExtras,
      search: window.location.search,
    })

    return data.validateSession
  } catch (error) {
    const shouldRefreshToken =
      !isLocalEnvironment() &&
      error?.status === 401 &&
      storeConfig.experimental?.refreshToken

    if (shouldRefreshToken) {
      const refreshed = await handleRefreshToken(session)
      if (refreshed) {
        sessionStore.set(refreshed)
      }
    }
  }
}

const [validationStore, onValidate, hasValidatedStore] =
  createValidationStore(validateSession)

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

export async function logoutAndClearSession(session: Session) {
  try {
    await fetch('/api/fs/logout', { method: 'POST' })
  } catch (logoutError) {
    console.error('Failed to call logout endpoint:', logoutError)
  }

  sessionStore.set({
    ...session,
    person: null,
    b2b: null,
    refreshAfter: null,
  })
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
 * The hook also provides session stability management to prevent UI blinking effects during session validation.
 * The session ready state is persisted in sessionStorage to maintain consistency across page navigations
 * and provide faster loading times on subsequent page visits.
 *
 * @param options - Optional configuration for the hook.
 * @param options.filter - A boolean value indicating whether to filter the channel object or not. Default is true.
 * @returns An object containing the session data, channel object, validation status, and session readiness status.
 */
export const useSession = ({ filter }: SessionOptions = { filter: true }) => {
  const currentSessionStore = sessionStore.read() ?? sessionStore.readInitial()
  const resultSessionStore = useStore(sessionStore)
  const isValidating = useStore(validationStore)
  const hasValidated = useStore(hasValidatedStore)
  const { isSessionReady } = useSessionReady({ isValidating, hasValidated })

  let { channel, ...session } = resultSessionStore ?? currentSessionStore

  if (filter) {
    channel = filterChannel(channel ?? '')
  }

  return useMemo(
    () => ({
      ...session,
      channel,
      isValidating,
      isSessionReady,
    }),
    [isValidating, session, channel, isSessionReady]
  )
}

/**
 * Custom hook to manage session readiness state.
 * Provides session stability management to prevent UI blinking effects during session validation.
 * The session ready state is persisted in sessionStorage to maintain consistency across page navigations
 * and provide faster loading times on subsequent page visits.
 *
 * Uses `hasValidated` (a reactive store value) instead of a ref-based transition tracker to avoid
 * a React 18 automatic batching race condition where `isValidating` goes true→false so fast that
 * the effect never observes the `true` state, leaving `isSessionReady` stuck at false.
 *
 * @param isValidating - Whether the session is currently being validated
 * @param hasValidated - Whether at least one validation cycle has ever completed
 * @returns An object containing the session readiness status
 */
export const useSessionReady = ({
  isValidating,
  hasValidated,
}: {
  isValidating: boolean
  hasValidated: boolean
}) => {
  // Initialize with persisted state from sessionStorage
  const [isSessionReady, setIsSessionReady] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return sessionStorage.getItem(SESSION_READY_KEY) === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    // Only mark ready once at least one full validation cycle has completed
    // and validation is not currently in flight.
    if (isValidating || !hasValidated) return

    setIsSessionReady(true)
    try {
      sessionStorage.setItem(SESSION_READY_KEY, 'true')
    } catch {
      // Ignore storage errors
    }
  }, [isValidating, hasValidated])

  return { isSessionReady }
}
