import deepEquals from 'fast-deep-equal'

import type { GraphqlContext } from '..'
import type {
  MutationValidateSessionArgs,
  StoreSession,
} from '../../../__generated__/schema'
import ChannelMarshal from '../utils/channel'
import { channelAfterSessionManager } from '../utils/sessionChannel'
import {
  buildB2bSession,
  buildMarketingData,
  buildPersonFromProfile,
  buildSessionSearchParams,
  getPreciseLocationData,
  resolveJwtClaims,
  resolveSellerInRegion,
} from '../utils/validateSessionHelpers'

type SessionStoreNamespace = {
  channel?: { value?: string | null } | null
  currencyCode?: { value?: string | null } | null
  currencySymbol?: { value?: string | null } | null
  countryCode?: { value?: string | null } | null
}

type SessionCheckoutNamespace = {
  regionId?: { value?: string | null } | null
}

export const validateSession = async (
  _: any,
  { session: oldSession, search }: MutationValidateSessionArgs,
  { clients, headers, account }: GraphqlContext
): Promise<StoreSession | null> => {
  const channel = ChannelMarshal.parse(oldSession.channel ?? '')
  const postalCode = String(oldSession.postalCode ?? '')
  const country = oldSession.country ?? ''
  let city = oldSession.city ?? null
  let geoCoordinates = oldSession.geoCoordinates ?? null

  const shouldGetPreciseLocation = !city || !geoCoordinates
  if (shouldGetPreciseLocation && postalCode !== '' && country !== '') {
    const preciseLocation = await getPreciseLocationData(
      clients,
      country,
      postalCode
    )
    city = preciseLocation.city
    geoCoordinates = preciseLocation.geoCoordinates
  }

  /**
   * The Session Manager API (https://developers.vtex.com/docs/api-reference/session-manager-api#patch-/api/sessions) adds the query params to the session public namespace.
   * This is used by Checkout (checkout-session) and Intelligent Search (search-session)
   */
  const params = buildSessionSearchParams(
    search,
    channel,
    postalCode,
    country,
    geoCoordinates,
    oldSession.locale
  )
  const marketingData = buildMarketingData(params, oldSession.marketingData)
  const { isRepresentative, customerId, unitId } = await resolveJwtClaims(
    clients,
    headers?.cookie,
    account
  )

  const sessionData = await clients.commerce
    .session(params.toString())
    .catch(() => null)

  const profile = sessionData?.namespaces.profile ?? null
  const shopper = sessionData?.namespaces.shopper ?? null
  const store = (sessionData?.namespaces.store ??
    null) as SessionStoreNamespace | null
  const authentication = sessionData?.namespaces.authentication ?? null
  const checkout = (sessionData?.namespaces.checkout ??
    null) as SessionCheckoutNamespace | null
  const publicData = sessionData?.namespaces.public ?? null

  let contract = null
  if (isRepresentative && profile?.id?.value) {
    try {
      contract = await clients.commerce.masterData.getContractById({
        contractId: profile.id.value,
      })
    } catch {
      console.error(
        `Error while getting contract data for profile ID (${profile.id.value}).\n`
      )
    }
  }

  const sellerId = await resolveSellerInRegion(
    clients,
    channel,
    postalCode,
    geoCoordinates,
    country,
    params.get('sc') ?? channel.salesChannel
  )

  const newSession = {
    ...oldSession,
    currency: {
      code: store?.currencyCode?.value ?? oldSession.currency.code,
      symbol: store?.currencySymbol?.value ?? oldSession.currency.symbol,
    },
    country: store?.countryCode?.value ?? country,
    channel: channelAfterSessionManager(
      channel,
      store?.channel?.value,
      checkout?.regionId?.value,
      sellerId
    ),
    /**
     * B2B data structure in Session:
     * - Logged user data (shopper): `shopper` namespace
     * - Unit data: `authentication` namespace
     * - Contract data: `profile` namespace (those info will be available inside Faststore's Session `person` object)
     */
    b2b: buildB2bSession({
      isRepresentative,
      authentication,
      shopper,
      publicData,
      profile,
      contract,
      customerId,
      unitId,
    }),
    marketingData,
    person: buildPersonFromProfile(profile),
    geoCoordinates:
      (geoCoordinates?.latitude &&
        geoCoordinates?.longitude &&
        geoCoordinates) ||
      null,
    city,
  }

  if (deepEquals(oldSession, newSession)) {
    return null
  }

  return newSession
}
