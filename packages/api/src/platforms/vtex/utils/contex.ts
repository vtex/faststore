import type { GraphqlContext } from '..'
import ChannelMarshal from './channel'

export const mutateChannelContext = (
  ctx: GraphqlContext,
  channelString: string
) => {
  ctx.storage.channel = ChannelMarshal.parse(channelString)
}

export const mutateLocaleContext = (ctx: GraphqlContext, locale: string) => {
  ctx.storage.locale = locale
}
