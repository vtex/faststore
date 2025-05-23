import deepEquals from 'fast-deep-equal'

import { parse } from 'cookie'
import type { Context } from '..'
import type {
  MutationValidateSessionArgs,
  StoreMarketingData,
  StoreSession,
} from '../../../__generated__/schema'
import ChannelMarshal from '../utils/channel'
import { parseJwt } from '../utils/cookies'

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
      `${geoCoordinates.latitude},${geoCoordinates.longitude}`
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

  const authCookie = parse(headers?.cookie ?? '')?.[
    'VtexIdclientAutCookie_' + account
  ]
  const jwt = parseJwt(authCookie)

  const isRepresentative = jwt?.isRepresentative
  const userId = jwt?.userId
  const customerId = jwt?.customerId

  const [sessionData, vtexid, unit, contract, user] = await Promise.all([
    clients.commerce.session(params.toString()).catch(() => null),

    isRepresentative
      ? clients.commerce.vtexid.validate().catch(() => null)
      : Promise.resolve(null),

    isRepresentative
      ? clients.commerce.units.getUnitByUserId({ userId }).catch(() => null)
      : Promise.resolve(null),

    isRepresentative
      ? clients.commerce.masterData
          .getContractById({ contractId: customerId })
          .catch(() => null)
      : Promise.resolve(null),

    isRepresentative
      ? clients.commerce.licenseManager
          .getUserById({ userId })
          .catch(() => null)
      : Promise.resolve(null),
  ])

  const profile = sessionData?.namespaces.profile ?? null
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
          customerId:
            authentication?.customerId?.value ??
            vtexid?.customerId ??
            customerId ??
            '',
          isRepresentative:
            vtexid?.isRepresentative ?? isRepresentative ?? false,
          unitName: unit?.name ?? vtexid?.unitName ?? '',
          unitId: unit?.id ?? '',
          isCorporate: contract?.isCorporate ?? false,
          corporateName: contract?.corporateName ?? '',
          firstName: contract?.firstName ?? '',
          lastName: contract?.lastName ?? '',
          userName: user?.name ?? '',
          userEmail: user?.email ?? '',
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
  }

  if (deepEquals(oldSession, newSession)) {
    return null
  }

  return newSession
}
