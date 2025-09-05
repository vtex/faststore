import deepEquals from 'fast-deep-equal'

import type { Context } from '..'
import type {
  MutationValidateSessionArgs,
  StoreMarketingData,
  StoreSession,
} from '../../../__generated__/schema'
import ChannelMarshal from '../utils/channel'
import {
  getAuthCookie,
  parseJwt,
  updatesContextStorageCookies,
} from '../utils/cookies'

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
  ctx: Context
): Promise<StoreSession | null> => {
  const { clients, headers, account } = ctx
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

  // Handle region_id parameter for vtex_segment cookie update for PDP regionalization
  // Usage example: /{productPage}/p?region_id=dnRleDpCUkE6MDQ1NjEwMDA=
  const regionIdParam = params.get('region_id')

  if (regionIdParam) {
    try {
      // Decode base64 encoded region_id
      const decodedRegionId = Buffer.from(regionIdParam, 'base64').toString(
        'utf-8'
      )

      // Extract postal code (last part after colon: "vtex:BRA:04561000" -> "04561000")
      const extractedPostalCode = decodedRegionId.split(':').pop()

      if (extractedPostalCode) {
        // Get existing vtex_segment cookie
        const cookies = headers?.cookie || ''
        const vtexSegmentMatch = cookies.match(/vtex_segment=([^;]*)/)

        if (vtexSegmentMatch) {
          const currentSegment = vtexSegmentMatch[1]

          // Decode the base64 cookie value
          const decodedSegment = Buffer.from(currentSegment, 'base64').toString(
            'utf-8'
          )

          const segmentData = JSON.parse(decodedSegment)
          segmentData.regionId = extractedPostalCode

          // Update cookie in context storage - encode back to base64
          const updatedSegmentJson = JSON.stringify(segmentData)
          const updatedSegmentBase64 = Buffer.from(
            updatedSegmentJson,
            'utf-8'
          ).toString('base64')
          const updatedCookie = `vtex_segment=${updatedSegmentBase64}; path=/`

          updatesContextStorageCookies(ctx, updatedCookie)
        }
      }
    } catch (error) {
      console.error('Error processing region_id parameter:', error)
    }
  }

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
  const publicData = sessionData?.namespaces.public ?? null

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
    country: store?.countryCode?.value ?? country,
    channel: ChannelMarshal.stringify({
      salesChannel: store?.channel?.value ?? channel.salesChannel,
      regionId: checkout?.regionId?.value ?? channel.regionId,
      seller: seller?.id,
      hasOnlyDefaultSalesChannel: !store?.channel?.value,
    }),
    /**
     * B2B data structure in Session:
     * - Logged user data (shopper): `shopper` namespace
     * - Unit data: `authentication` namespace
     * - Contract data: `profile` namespace (those info will be available inside Faststore's Session `person` object)
     */
    b2b: isRepresentative
      ? {
          isRepresentative: isRepresentative ?? false,
          customerId: authentication?.customerId?.value ?? customerId ?? '',
          unitName: authentication?.unitName?.value ?? '',
          unitId: authentication?.unitId?.value ?? unitId ?? '',
          firstName: shopper?.firstName?.value ?? '',
          lastName: shopper?.lastName?.value ?? '',
          userName:
            `${shopper?.firstName?.value ?? ''} ${shopper?.lastName?.value ?? ''}`.trim(),
          userEmail: authentication?.storeUserEmail.value ?? '',
          savedPostalCode: publicData?.postalCode?.value ?? '',
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
