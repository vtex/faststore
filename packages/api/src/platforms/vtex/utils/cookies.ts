import type { Context } from '../index'

export const setCookie = (headers: Headers, ctx: Context) => {
  ctx.storage.cookies = headers?.getSetCookie() ?? []
}

export const getStoreCookie = (ctx: Context) => (headers: Headers) =>
  setCookie(headers, ctx)
