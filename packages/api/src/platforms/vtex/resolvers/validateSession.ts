import deepEquals from 'fast-deep-equal'

import type { Context } from '..'
import type {
  MutationValidateSessionArgs,
  StoreMarketingData,
  StoreSession,
} from '../../../__generated__/schema'
import ChannelMarshal from '../utils/channel'
import { getAuthCookie, parseJwt } from '../utils/cookies'

async function getPreciseLocationData(
  clients: Context['clients'],
  country: string,
  postalCode: string
) {
  try {
    const address = await clients.commerce.checkout.address({
      postalCode,
      country,
    })

    const [longitude, latitude] = address.geoCoordinates
    return { city: address.city, geoCoordinates: { latitude, longitude } }
  } catch (err) {
    console.error(
      `Error while getting geo coordinates for the current postal code (${postalCode}) and country (${country}).\n`
    )

    throw err
  }
}

export const validateSession = async (
  _: any,
  { session: oldSession, search }: MutationValidateSessionArgs,
  { clients, headers, account }: Context
): Promise<StoreSession | null> => {
  const channel = ChannelMarshal.parse(oldSession.channel ?? '')
  const postalCode = String(oldSession.postalCode ?? '')
  const country = oldSession.country ?? ''
  let city = oldSession.city ?? null
  let geoCoordinates = oldSession.geoCoordinates ?? null

  // Update location data if postal code and country are provided
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
  const params = new URLSearchParams(search)
  const salesChannel = params.get('sc') ?? channel.salesChannel
  params.set('sc', salesChannel)

  if (!!postalCode) {
    params.set('postalCode', postalCode)
  }

  if (!!country) {
    params.set('country', country)
  }

  if (!!geoCoordinates) {
    params.set(
      'geoCoordinates',
      `${geoCoordinates.longitude},${geoCoordinates.latitude}` // long,lat is the format expected
    )
  }

  const { marketingData: oldMarketingData } = oldSession

  const marketingData: StoreMarketingData = {
    utmCampaign:
      params.get('utm_campaign') ?? oldMarketingData?.utmCampaign ?? '',
    utmMedium: params.get('utm_medium') ?? oldMarketingData?.utmMedium ?? '',
    utmSource: params.get('utm_source') ?? oldMarketingData?.utmSource ?? '',
    utmiCampaign: params.get('utmi_cp') ?? oldMarketingData?.utmiCampaign ?? '',
    utmiPage: params.get('utmi_p') ?? oldMarketingData?.utmiPage ?? '',
    utmiPart: params.get('utmi_pc') ?? oldMarketingData?.utmiPart ?? '',
  }

  const jwt = parseJwt(getAuthCookie(headers?.cookie ?? '', account))

  const isRepresentative = jwt?.isRepresentative
  const customerId = jwt?.customerId
  const unitId = jwt?.unitId

  const sessionData = await clients.commerce
    .session(params.toString())
    .catch(() => null)

  const profile = sessionData?.namespaces.profile ?? null
  const shopper = sessionData?.namespaces.shopper ?? null
  const store = sessionData?.namespaces.store ?? null
  const authentication = sessionData?.namespaces.authentication ?? null
  const checkout = sessionData?.namespaces.checkout ?? null

  // Set seller only if it's inside a region
  let seller
  if (!!channel.seller && (postalCode || geoCoordinates)) {
    const regionData = await clients.commerce.checkout.region({
      postalCode,
      geoCoordinates,
      country,
      salesChannel,
    })
    const region = regionData?.[0]
    seller = region?.sellers.find((seller) => channel.seller === seller.id)
  }

  const newSession = {
    ...oldSession,
    currency: {
      code: store?.currencyCode?.value ?? oldSession.currency.code,
      symbol: store?.currencySymbol?.value ?? oldSession.currency.symbol,
    },
    country: store?.countryCode?.value ?? oldSession.country,
    channel: ChannelMarshal.stringify({
      salesChannel: store?.channel?.value ?? channel.salesChannel,
      regionId: checkout?.regionId?.value ?? channel.regionId,
      seller: seller?.id,
      hasOnlyDefaultSalesChannel: !store?.channel?.value,
    }),
    b2b: isRepresentative
      ? {
          isRepresentative: isRepresentative ?? false,
          customerId: authentication?.customerId?.value ?? customerId ?? '', //contract
          unitName: authentication?.unitName?.value ?? '', // organization name
          unitId: authentication?.unitId?.value ?? unitId ?? '', // organization id
          firstName: profile?.firstName?.value ?? '', // contract name for b2b
          lastName: profile?.lastName?.value ?? '',
          userName: shopper?.firstName?.value ?? '', // shopper
          userEmail: authentication?.storeUserEmail.value ?? '',
        }
      : null,
    marketingData,
    person: profile?.id
      ? {
          id: profile.id?.value ?? '',
          email: profile.email?.value ?? '',
          givenName: profile.firstName?.value ?? '',
          familyName: profile.lastName?.value ?? '',
        }
      : null,
    geoCoordinates,
    city,
    postalCode: isRepresentative // case b2b - use postalCode if available
      ? sessionData?.namespaces.public?.postalCode?.value
      : null,
  }

  if (deepEquals(oldSession, newSession)) {
    return null
  }

  return newSession
}
