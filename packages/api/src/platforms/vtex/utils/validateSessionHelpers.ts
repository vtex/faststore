import type { GraphqlContext } from '..'
import type {
  StoreMarketingData,
  StoreSession,
} from '../../../__generated__/schema'
import type { Channel } from './channel'
import { resolveActiveContractDisplayName } from './contract'
import { getAuthCookie, parseJwt } from './cookies'

export async function getPreciseLocationData(
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

export function buildSessionSearchParams(
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

export function buildMarketingData(
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

export async function resolveJwtClaims(
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
    customerId: isValidJwt ? jwt?.customerId : undefined,
    unitId: isValidJwt ? jwt?.unitId : undefined,
  }
}

export async function resolveSellerInRegion(
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

/**
 * First value that is a non-blank string, trimmed. Session values and JWT
 * claims are only nominally typed, so anything else is skipped.
 */
export function firstNonBlank(...values: unknown[]): string {
  for (const value of values) {
    const trimmed = typeof value === 'string' ? value.trim() : ''
    if (trimmed) return trimmed
  }

  return ''
}

/**
 * Organizational unit of the shopper, from the session or the JWT claim.
 * Buyer Portal identifies its buyers by the unit; `isRepresentative` alone is
 * not enough, since it can be true outside B2B.
 */
export function resolveB2bUnitId(
  authentication: { unitId?: { value?: string | null } | null } | null,
  jwtUnitId?: unknown
): string {
  return firstNonBlank(authentication?.unitId?.value, jwtUnitId)
}

/**
 * Returns `null` unless the shopper has both an organizational unit and a
 * contract, the rule Buyer Portal uses for a B2B session.
 *
 * The contract falls back from the session's active contract to the session's
 * authentication namespace and then to the JWT claim. Blank values fall
 * through, so an empty session value never hides the claim.
 *
 * The deprecated `isRepresentative` field stays `true` whenever `b2b` is
 * returned, so consumers that still read it keep working.
 */
export function buildB2bSession(args: {
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
    activeContractId?: { value?: string | null } | null
  } | null
  publicData: { postalCode?: { value?: string | null } | null } | null
  profile: Parameters<typeof resolveActiveContractDisplayName>[1]
  contract: Parameters<typeof resolveActiveContractDisplayName>[0]
  customerId?: string
  unitId?: string
}) {
  const unitId = resolveB2bUnitId(args.authentication, args.unitId)
  const customerId = firstNonBlank(
    args.shopper?.activeContractId?.value,
    args.authentication?.customerId?.value,
    args.customerId
  )

  if (!unitId || !customerId) {
    return null
  }

  const firstName = shopperString(args.shopper?.firstName)
  const lastName = shopperString(args.shopper?.lastName)

  return {
    isRepresentative: true,
    customerId,
    unitName: args.authentication?.unitName?.value ?? '',
    unitId,
    firstName,
    lastName,
    userName: `${firstName} ${lastName}`.trim(),
    userEmail: args.authentication?.storeUserEmail?.value ?? '',
    savedPostalCode: args.publicData?.postalCode?.value ?? '',
    contractName: resolveActiveContractDisplayName(args.contract, args.profile),
    organizationManager: args.shopper?.organizationManager?.value ?? false,
  }
}

export function buildPersonFromProfile(
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
