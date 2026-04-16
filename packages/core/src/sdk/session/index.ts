import type { Session } from '@faststore/sdk'
import { createSessionStore } from '@faststore/sdk'
import { useEffect, useMemo, useRef, useState } from 'react'

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
import { getSettings } from '../localization/settings'
import { createValidationStore, useStore } from '../useStore'
import { getPostalCode } from '../userLocation/index'

const SESSION_READY_KEY = 'faststore_session_ready'

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
      error?.status === 401 && storeConfig.experimental?.refreshToken

    if (shouldRefreshToken) {
      const result = await refreshTokenRequest()

      if (isRefreshTokenSuccessful(result)) {
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

/**
 * Computes the initial session value by merging the URL-derived locale,
 * currency, and sales channel into the default session config.
 *
 * Without this, the session store initializes with the default locale from
 * discovery.config.  The persisted middleware then hydrates from IDB (or
 * falls back to readInitial()) and triggers validateSession with that
 * default/stale locale.  Only later, in a useEffect, does
 * useLocalizationConfig detect the URL locale and correct the session —
 * causing a second, redundant pair of validateSession + validateCart calls.
 *
 * By seeding the initial value with the URL locale we ensure:
 * 1. readInitial() already contains the correct locale (fixes first-visit).
 * 2. The correction subscriber below can fix IDB payloads that carry an
 *    outdated locale without an extra round-trip.
 */
function getInitialSession(): Session {
  if (!storeConfig.localization?.enabled || typeof window === 'undefined') {
    return storeConfig.session
  }

  try {
    const settings = getSettings()
    const channel = JSON.parse(storeConfig.session.channel ?? '{}') ?? {}
    channel.salesChannel = settings.salesChannel

    return {
      ...storeConfig.session,
      locale: settings.locale,
      currency: settings.currency,
      channel: JSON.stringify(channel),
    }
  } catch {
    return storeConfig.session
  }
}

const urlAwareInitialSession = getInitialSession()
const defaultStore = createSessionStore(urlAwareInitialSession, onValidate)

/**
 * One-time subscriber that corrects the locale when the persisted middleware
 * hydrates a session from IDB whose locale/currency/channel differ from
 * the current URL binding.
 *
 * Because this subscriber is registered after the optimistic middleware's
 * subscriber, it fires within the same synchronous store.set() call.
 * Calling defaultStore.set() here re-enters the base store's set(), which
 * cancels the previously-enqueued optimistic handler (wrong locale) and
 * enqueues a new one (correct locale) — resulting in a single API call.
 */
if (storeConfig.localization?.enabled && typeof window !== 'undefined') {
  let corrected = false

  defaultStore.subscribe((session: Session) => {
    if (corrected) return
    corrected = true

    if (
      session.locale === urlAwareInitialSession.locale &&
      deepEqual(session.currency, urlAwareInitialSession.currency) &&
      session.channel === urlAwareInitialSession.channel
    ) {
      return
    }

    const channel = JSON.parse(session.channel ?? '{}') ?? {}
    channel.salesChannel = JSON.parse(
      urlAwareInitialSession.channel ?? '{}'
    )?.salesChannel

    defaultStore.set({
      ...session,
      locale: urlAwareInitialSession.locale,
      currency: urlAwareInitialSession.currency,
      channel: JSON.stringify(channel),
    })
  })
}

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
  const { isSessionReady } = useSessionReady({ isValidating })

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
 * @param isValidating - Whether the session is currently being validated
 * @returns An object containing the session readiness status
 */
export const useSessionReady = ({
  isValidating,
}: { isValidating: boolean }) => {
  // Initialize with persisted state from sessionStorage
  const [isSessionReady, setIsSessionReady] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return sessionStorage.getItem(SESSION_READY_KEY) === 'true'
    } catch {
      return false
    }
  })

  // Wait for session to be stable (not validating and has consistent data)
  const hasValidatedRef = useRef(false)

  useEffect(() => {
    // Only run the effect if there has already been a change in isValidating (that is, validateSession has already been called at least once)
    if (!hasValidatedRef.current && isValidating) {
      hasValidatedRef.current = true
      return
    }

    if (!hasValidatedRef.current) {
      return
    }

    if (!isValidating) {
      setIsSessionReady(true)
      // Persist the ready state in sessionStorage
      try {
        sessionStorage.setItem(SESSION_READY_KEY, 'true')
      } catch {
        // Ignore storage errors
      }
      return
    }

    // Only set to false if we don't have a persisted ready state
    if (typeof window !== 'undefined') {
      try {
        const persistedReady =
          sessionStorage.getItem(SESSION_READY_KEY) === 'true'
        if (!persistedReady) {
          setIsSessionReady(false)
        }
      } catch {
        setIsSessionReady(false)
      }
    }
  }, [isValidating])

  return { isSessionReady }
}
