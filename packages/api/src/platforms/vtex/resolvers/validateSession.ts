import deepEquals from 'fast-deep-equal'

import ChannelMarshal from '../utils/channel'
import { getCookie } from '../utils/getCookie'
import type { Context } from '..'
import type {
  MutationValidateSessionArgs,
  StoreSession,
} from '../../../__generated__/schema'

export const validateSession = async (
  _: any,
  { session: oldSession, search }: MutationValidateSessionArgs,
  { clients, headers }: Context,
): Promise<StoreSession | null> => {

  const channel = ChannelMarshal.parse(oldSession.channel ?? '')
  const postalCode = String(oldSession.postalCode ?? '').replace(/\D/g, '')
  const country = oldSession.country ?? ''

  const params = new URLSearchParams(search)
  const salesChannel = params.get('sc') ?? channel.salesChannel
  const vtexsession = getCookie('vtex_session', headers.cookie) ?? ''
  console.log(vtexsession)

  params.set('sc', salesChannel)

  const [regionData, sessionData] = await Promise.all([
    postalCode
      ? clients.commerce.checkout.region({ postalCode, country, salesChannel })
      : Promise.resolve(null),
    clients.commerce.session(params.toString()).catch(() => null),
  ])

  const profile = sessionData?.namespaces.profile ?? null
  const store = sessionData?.namespaces.store ?? null
  const region = regionData?.[0]
  // Set seller only if it's inside a region
  const seller = region?.sellers.find(seller => channel.seller === seller.id)

  const newSession = {
    ...oldSession,
    id: vtexsession,
    currency: {
      code: store?.currencyCode.value ?? oldSession.currency.code,
      symbol: store?.currencySymbol.value ?? oldSession.currency.symbol,
    },
    country: store?.countryCode.value ?? oldSession.country,
    channel: ChannelMarshal.stringify({
      salesChannel: store?.channel?.value ?? channel.salesChannel,
      regionId: region?.id ?? channel.regionId,
      seller: seller?.id
    }),
    person: profile?.id
      ? {
          id: profile.id?.value ?? '',
          email: profile.email?.value ?? '',
          givenName: profile.firstName?.value ?? '',
          familyName: profile.lastName?.value ?? '',
        }
      : null,
  }

  if (deepEquals(oldSession, newSession)) {
    return null
  }

  return newSession
}
