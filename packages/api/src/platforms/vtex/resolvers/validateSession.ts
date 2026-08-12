import deepEquals from 'fast-deep-equal'

import type { GraphqlContext } from '..'
import type {
  MutationValidateSessionArgs,
  StoreMarketingData,
  StoreSession,
} from '../../../__generated__/schema'
import type { Channel } from '../utils/channel'
import ChannelMarshal from '../utils/channel'
import { resolveActiveContractDisplayName } from '../utils/contract'
import { getAuthCookie, parseJwt } from '../utils/cookies'
import { channelAfterSessionManager } from '../utils/sessionChannel'

type SessionStoreNamespace = {
  channel?: { value?: string | null } | null
  currencyCode?: { value?: string | null } | null
  currencySymbol?: { value?: string | null } | null
  countryCode?: { value?: string | null } | null
}

type SessionCheckoutNamespace = {
  regionId?: { value?: string | null } | null
}

async function getPreciseLocationData(
  clients: GraphqlContext['clients'],
  country: string,
  postalCode: string
) {
  try {
    const address = await clients.commerce.checkout.address({
      postalCode,
      country,
    })

    const geoCoordinates = address.geoCoordinates
      ? {
          latitude: address.geoCoordinates[1],
          longitude: address.geoCoordinates[0],
        }
      : null

    return { city: address.city, geoCoordinates }
  } catch (err) {
    console.error(
      `Error while getting geo coordinates for the current postal code (${postalCode}) and country (${country}).\n`
    )

    throw err
  }
}

function buildSessionSearchParams(
  search: string,
  channel: Required<Channel>,
  postalCode: string,
  country: string,
  geoCoordinates: StoreSession['geoCoordinates'],
  locale: string
) {
  const params = new URLSearchParams(search)

  // Remove facets so they do not interfere with session data / vtex_segment
  if (params.has('facets')) {
    params.delete('facets')
  }

  params.set('sc', params.get('sc') ?? channel.salesChannel)

  if (postalCode) {
    params.set('postalCode', postalCode)
  }

  if (country) {
    params.set('country', country)
  }

  if (geoCoordinates) {
    params.set(
      'geoCoordinates',
      `${geoCoordinates.longitude},${geoCoordinates.latitude}` // long,lat is the format expected
    )
  }

  // Sending the locale to the session, the store-session app will update cultureInfo
  params.set('locale', locale)

  return params
}

function buildMarketingData(
  params: URLSearchParams,
  oldMarketingData: StoreSession['marketingData']
): StoreMarketingData {
  return {
    utmCampaign:
      params.get('utm_campaign') ?? oldMarketingData?.utmCampaign ?? '',
    utmMedium: params.get('utm_medium') ?? oldMarketingData?.utmMedium ?? '',
    utmSource: params.get('utm_source') ?? oldMarketingData?.utmSource ?? '',
    utmiCampaign: params.get('utmi_cp') ?? oldMarketingData?.utmiCampaign ?? '',
    utmiPage: params.get('utmi_p') ?? oldMarketingData?.utmiPage ?? '',
    utmiPart: params.get('utmi_pc') ?? oldMarketingData?.utmiPart ?? '',
  }
}

async function resolveJwtClaims(
  clients: GraphqlContext['clients'],
  cookie: string | undefined,
  account: string
) {
  const jwt = parseJwt(getAuthCookie(cookie ?? '', account))
  let isValidJwt = false

  if (jwt) {
    try {
      const vtexIdResponse = await clients.commerce.vtexid.validate()
      isValidJwt = vtexIdResponse?.authStatus?.toLowerCase() === 'success'
    } catch (error) {
      console.warn('JWT validation failed:', error)
      isValidJwt = false
    }
  }

  return {
    isRepresentative: isValidJwt ? Boolean(jwt?.isRepresentative) : false,
    customerId: isValidJwt ? jwt?.customerId : undefined,
    unitId: isValidJwt ? jwt?.unitId : undefined,
  }
}

async function resolveSellerInRegion(
  clients: GraphqlContext['clients'],
  channel: Required<Channel>,
  postalCode: string,
  geoCoordinates: StoreSession['geoCoordinates'],
  country: string,
  salesChannel: string
) {
  if (!channel.seller || !(postalCode || geoCoordinates)) {
    return undefined
  }

  const regionData = await clients.commerce.checkout.region({
    postalCode,
    geoCoordinates,
    country,
    salesChannel,
  })
  const region = regionData?.[0]

  return region?.sellers.find((seller) => channel.seller === seller.id)?.id
}

function shopperString(value: { value?: unknown } | null | undefined): string {
  return typeof value?.value === 'string' ? value.value : ''
}

function buildB2bSession(args: {
  isRepresentative: boolean
  authentication: {
    customerId?: { value?: string | null } | null
    unitName?: { value?: string | null } | null
    unitId?: { value?: string | null } | null
    storeUserEmail?: { value?: string | null } | null
  } | null
  shopper: {
    firstName?: { value?: unknown } | null
    lastName?: { value?: unknown } | null
    organizationManager?: { value?: boolean | null } | null
  } | null
  publicData: { postalCode?: { value?: string | null } | null } | null
  profile: Parameters<typeof resolveActiveContractDisplayName>[1]
  contract: Parameters<typeof resolveActiveContractDisplayName>[0]
  customerId?: string
  unitId?: string
}) {
  if (!args.isRepresentative) {
    return null
  }

  const firstName = shopperString(args.shopper?.firstName)
  const lastName = shopperString(args.shopper?.lastName)

  return {
    isRepresentative: true,
    customerId: args.authentication?.customerId?.value ?? args.customerId ?? '',
    unitName: args.authentication?.unitName?.value ?? '',
    unitId: args.authentication?.unitId?.value ?? args.unitId ?? '',
    firstName,
    lastName,
    userName: `${firstName} ${lastName}`.trim(),
    userEmail: args.authentication?.storeUserEmail?.value ?? '',
    savedPostalCode: args.publicData?.postalCode?.value ?? '',
    contractName: resolveActiveContractDisplayName(args.contract, args.profile),
    organizationManager: args.shopper?.organizationManager?.value ?? false,
  }
}

function buildPersonFromProfile(
  profile: {
    id?: { value?: string | null } | null
    email?: { value?: string | null } | null
    firstName?: { value?: string | null } | null
    lastName?: { value?: string | null } | null
  } | null
) {
  if (!profile?.id) {
    return null
  }

  return {
    id: profile.id?.value ?? '',
    email: profile.email?.value ?? '',
    givenName: profile.firstName?.value ?? '',
    familyName: profile.lastName?.value ?? '',
  }
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
