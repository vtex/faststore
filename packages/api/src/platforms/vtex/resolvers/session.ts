import type { Context } from '..'
import type { MutationSessionArgs } from '../../../__generated__/schema'
import ChannelParser from '../utils/channel'

export default async function sessionResolvers(
  _: any,
  { session }: MutationSessionArgs,
  { clients }: Context
) {
  const channelParser = new ChannelParser(session?.channel ?? '')
  const regionData = await clients.commerce.checkout.region({
    postalCode: String(session.postalCode ?? '').replace(/\D/g, ''),
    country: session.country ?? '',
  })

  channelParser.updateChannel({ regionId: regionData?.[0]?.id })

  return { ...session, channel: channelParser.stringify() }
}
