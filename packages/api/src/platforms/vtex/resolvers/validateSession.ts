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
 * Sends the updated public field to the Session Manager API (https://developers.vtex.com/docs/api-reference/session-manager-api/#patch-/api/sessions) for session update.
 * This is required for Intelligent Search to work properly with the Delivery Promise feature.
 *
 * @param clients - The clients object from the application context, containing the commerce client.
 * @param session - The current store session containing postal code, country, and geo-coordinates.
 * @param enableDeliveryPromise - A boolean indicating if the Delivery Promise feature is enabled.
 *
 * @returns A promise that resolves when the session is successfully updated.
 */
async function updateSessionWithLocation(
  clients: Context['clients'],
  { postalCode, country, geoCoordinates }: StoreSession,
  enableDeliveryPromise?: boolean
) {
  const hasRequiredLocationData = !!postalCode && !!country && !!geoCoordinates
  if (!(enableDeliveryPromise && hasRequiredLocationData)) {
    // Update the session with the location data only if the Delivery Promise feature flag is enabled and if all required data is available
    // otherwise there will be make unnecessary requests and operations from FastStore and Intelligent Search
    return
  }

  try {
    return clients.commerce.updateSession({
      public: {
        postalCode: { value: postalCode },
        geoCoordinates: {
          value: `${geoCoordinates.latitude},${geoCoordinates.longitude}`,
        },
        country: { value: country },
      },
    })
  } catch (err) {
    console.error(
      `Error while updating the Session's public field with postal code (${postalCode}), country (${country}) and geo-coordinates (${geoCoordinates}).\n`
    )

    throw err
  }
}

export const validateSession = async (
  _: any,
  { session: oldSession, search }: MutationValidateSessionArgs,
  {
    clients,
    storage: {
      flags: { enableDeliveryPromise },
    },
  }: Context
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

  await updateSessionWithLocation(clients, newSession, enableDeliveryPromise)

  return newSession
}
