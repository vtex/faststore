import type { Context } from '..'
import ChannelMarshal from './channel'

export const mutateChannelContext = (ctx: Context, channelString: string) => {
  ctx.storage.channel = ChannelMarshal.parse(channelString)
}

export const mutateLocaleContext = (ctx: Context, locale: string) => {
  ctx.storage.locale = locale
}
