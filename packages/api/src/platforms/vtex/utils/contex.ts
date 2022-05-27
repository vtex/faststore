import ChannelMarshal from './channel'
import type { Context } from '..'

export const mutateChannelContext = (ctx: Context, channelString: string) => {
  ctx.storage.channel = ChannelMarshal.parse(channelString)
}

export const mutateLocaleContext = (ctx: Context, locale: string) => {
  ctx.storage.locale = locale
}
