import type { Context } from '..'
import type {
  MutationUpdateSessionArgs,
  StoreSession,
} from '../../../__generated__/schema'
import ChannelMarshal from '../utils/channel'

export const updateSession = async (
  _: any,
  { session }: MutationUpdateSessionArgs,
  { clients }: Context
): Promise<StoreSession> => {
  const channel = ChannelMarshal.parse(session.channel ?? '')
  const regionData = await clients.commerce.checkout.region({
    postalCode: String(session.postalCode ?? '').replace(/\D/g, ''),
    country: session.country ?? '',
  })

  return {
    ...session,
    channel: ChannelMarshal.stringify({
      ...channel,
      regionId: regionData?.[0]?.id,
    }),
  }
}
