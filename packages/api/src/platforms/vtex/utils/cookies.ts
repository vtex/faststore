import type { Context } from '../index'

export const setCookie = (headers: Headers, ctx: Context) => {
  headers.getSetCookie().forEach((cookie) => ctx.storage.cookies.add(cookie))
}

export const getStoreCookie = (ctx: Context) => (headers: Headers) =>
  setCookie(headers, ctx)
