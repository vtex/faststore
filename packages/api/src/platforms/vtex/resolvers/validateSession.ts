import deepEquals from 'fast-deep-equal'

import type { Context } from '..'
import type {
  MutationValidateSessionArgs,
  StoreMarketingData,
  StoreSession,
} from '../../../__generated__/schema'
import ChannelMarshal from '../utils/channel'

async function getGeoCoordinates(
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
    return { latitude, longitude }
  } catch (err) {
    console.error(
      `Error while getting geo coordinates for the current postal code (${postalCode}) and country (${country}).\n`
    )

    throw err
  }
}

/**
 * Sends the updated facets to the Session Manager API (https://developers.vtex.com/docs/api-reference/session-manager-api/#patch-/api/sessions) for session update.
 * This is required for Intelligent Search to work properly with Delivery Promise feature. They handle the location information by accessing the session's public facets field.
 *
 * @param clients - The clients object from the application context, containing the commerce client.
 * @param session - The current store session containing postal code, country, and geo-coordinates.
 *
 * @returns A promise that resolves when the session facets are successfully updated.
 */
async function updateSessionFacets(
  clients: Context['clients'],
  { postalCode, country, geoCoordinates }: StoreSession
) {
  try {
    const shouldUpdate = !!postalCode && !!country && !!geoCoordinates
    if (!shouldUpdate) {
      // Early return when postal code, country, or geo-coordinates are not provided
      return
    }

    const facetsObject = {
      'zip-code': postalCode,
      country,
      coordinates: `${geoCoordinates.latitude},${geoCoordinates.longitude}`,
    }
    const facets = Object.entries(facetsObject)
      .map(([key, value]) => `${key}=${value}`)
      .join(';')

    return clients.commerce.updateSession({
      public: { facets: { value: facets } },
    })
  } catch (err) {
    console.error(
      `Error while updating the Session's facets field with postal code (${postalCode}), country (${country}) and geo-coordinates (${geoCoordinates}).\n`
    )

    throw err
  }
}

export const validateSession = async (
  _: any,
  { session: oldSession, search }: MutationValidateSessionArgs,
  { clients }: Context
): Promise<StoreSession | null> => {
  const channel = ChannelMarshal.parse(oldSession.channel ?? '')
  const postalCode = String(oldSession.postalCode ?? '')
  const country = oldSession.country ?? ''

  // Get geo coordinates if postal code and country are provided
  let geoCoordinates = oldSession.geoCoordinates ?? null
  if (!geoCoordinates && postalCode !== '' && country !== '') {
    geoCoordinates = await getGeoCoordinates(clients, country, postalCode)
  }

  const params = new URLSearchParams(search)
  const salesChannel = params.get('sc') ?? channel.salesChannel

  params.set('sc', salesChannel)

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

  const [regionData, sessionData] = await Promise.all([
    postalCode || geoCoordinates
      ? clients.commerce.checkout.region({
          postalCode,
          geoCoordinates,
          country,
          salesChannel,
        })
      : Promise.resolve(null),
    clients.commerce.session(params.toString()).catch(() => null),
  ])

  const profile = sessionData?.namespaces.profile ?? null
  const store = sessionData?.namespaces.store ?? null
  const authentication = sessionData?.namespaces.authentication ?? null
  const region = regionData?.[0]
  // Set seller only if it's inside a region
  const seller = region?.sellers.find((seller) => channel.seller === seller.id)

  const newSession = {
    ...oldSession,
    currency: {
      code: store?.currencyCode?.value ?? oldSession.currency.code,
      symbol: store?.currencySymbol?.value ?? oldSession.currency.symbol,
    },
    country: store?.countryCode?.value ?? oldSession.country,
    channel: ChannelMarshal.stringify({
      salesChannel: store?.channel?.value ?? channel.salesChannel,
      regionId: region?.id ?? channel.regionId,
      seller: seller?.id,
      hasOnlyDefaultSalesChannel: !store?.channel?.value,
    }),
    b2b: {
      customerId: authentication?.customerId?.value ?? '',
    },
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
  }

  if (deepEquals(oldSession, newSession)) {
    return null
  }

  await updateSessionFacets(clients, newSession)

  return newSession
}
