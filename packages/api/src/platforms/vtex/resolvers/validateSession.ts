import deepEquals from 'fast-deep-equal'

import type { GraphqlContext } from '..'
import type {
  MutationValidateSessionArgs,
  StoreSession,
} from '../../../__generated__/schema'
import ChannelMarshal from '../utils/channel'
import { FastStoreError } from '../../errors'
import {
  channelAfterSessionManager,
  rejectedSalesChannelOf,
  type SalesChannelSource,
  salesChannelSourceOf,
  salesChannelToRequest,
} from '../utils/sessionChannel'
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

const isSalesChannelRejected = (error: unknown) =>
  error instanceof FastStoreError &&
  (error.extensions.status === 401 || error.extensions.status === 403)

/**
 * Whether the rejection is about the requested SC (e.g. "You must be logged
 * in to access the requested SalesChannel"), not an unrelated auth failure.
 * Only then is an adopted SC recorded as rejected.
 */
const isAboutSalesChannel = (error: unknown) =>
  error instanceof Error && /sales\s*channel/i.test(error.message)

/**
 * Whether a Session Manager rejection drops the `orderForm` adoption: only
 * when the rejected `sc` is the adopted SC itself and the error is about the
 * sales channel. A rejected `?sc=` from the page URL or an unrelated 401/403
 * keeps the adoption.
 */
const rejectsAdoption = (
  error: unknown,
  salesChannelSource: SalesChannelSource | undefined,
  requestedSalesChannel: string | undefined,
  clientSalesChannel: string
) => {
  if (
    salesChannelSource !== 'orderForm' ||
    requestedSalesChannel !== clientSalesChannel
  ) {
    return false
  }

  if (isAboutSalesChannel(error)) {
    return true
  }

  // Session Manager has no structured code for this; make a wording change
  // observable instead of silently keeping the adoption.
  console.warn(
    `[validateSession] Session Manager rejected adopted sales channel ${requestedSalesChannel} with an unrecognized error; keeping the adoption.`,
    error instanceof Error ? error.message : error
  )

  return false
}

/**
 * Calls Session Manager. When it rejects the requested `sc` (401/403), retries
 * once without it so Session Manager resolves an SC the shopper can use:
 * - no marker: a stale SC (e.g. left by an older version) would stick forever;
 * - `orderForm` marker: if the adopted SC itself is not available to this
 *   shopper, the adoption is dropped and the SC is recorded as rejected
 *   (see `rejectsAdoption`);
 * - `url` marker: the URL SC is intentional, so no retry.
 * If the retry also fails, the current channel is kept as is.
 */
const fetchSessionData = async (
  clients: GraphqlContext['clients'],
  params: URLSearchParams,
  salesChannelSource: SalesChannelSource | undefined,
  clientSalesChannel: string
) => {
  const unchanged = { salesChannelSource, rejectedSalesChannel: undefined }

  try {
    return {
      ...unchanged,
      sessionData: await clients.commerce.session(params.toString()),
    }
  } catch (error) {
    if (salesChannelSource === 'url' || !isSalesChannelRejected(error)) {
      return { ...unchanged, sessionData: null }
    }

    const requestedSalesChannel = params.get('sc') ?? undefined
    const dropsAdoption = rejectsAdoption(
      error,
      salesChannelSource,
      requestedSalesChannel,
      clientSalesChannel
    )

    params.delete('sc')

    const sessionData = await clients.commerce
      .session(params.toString())
      .catch(() => null)

    if (!sessionData || !dropsAdoption) {
      return { ...unchanged, sessionData }
    }

    return {
      sessionData,
      salesChannelSource: undefined,
      rejectedSalesChannel: requestedSalesChannel,
    }
  }
}

export const validateSession = async (
  _: any,
  { session: oldSession, search }: MutationValidateSessionArgs,
  { clients, headers, account, storage }: GraphqlContext
): Promise<StoreSession | null> => {
  const clientChannel = ChannelMarshal.parse(oldSession.channel ?? '')
  const incomingSalesChannelSource = salesChannelSourceOf(oldSession.channel)
  const channel = {
    ...clientChannel,
    salesChannel: salesChannelToRequest(
      clientChannel,
      incomingSalesChannelSource,
      storage?.channel?.salesChannel
        ? String(storage.channel.salesChannel)
        : undefined,
      search
    ),
  }
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

  const { sessionData, salesChannelSource, rejectedSalesChannel } =
    await fetchSessionData(
      clients,
      params,
      incomingSalesChannelSource,
      String(channel.salesChannel ?? '')
    )

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
    params.get('sc') ?? store?.channel?.value ?? channel.salesChannel
  )

  const person = buildPersonFromProfile(profile)
  // A rejection belongs to the shopper it was recorded for: forget it when
  // they log in or out, so a new identity can have the SC adopted again.
  const previousRejection =
    (oldSession.person?.id ?? null) === (person?.id ?? null)
      ? rejectedSalesChannelOf(oldSession.channel)
      : undefined

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
      sellerId,
      salesChannelSource,
      rejectedSalesChannel ?? previousRejection
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
    person,
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
