import type { Context } from '../index'

const MATCH_DOMAIN_REGEXP = /(?:^|;\s*)(?:domain=)([^;]+)/i

export const setCookie = (headers: Headers, ctx: Context) => {
  const faststoreAPIHostname = new URL(`https://${ctx.headers.host}`).hostname

  headers
    .getSetCookie()
    .forEach((cookie) =>
      ctx.storage.cookies.add(
        // Replaces original cookie domain for FastStore API's domain hostname
        cookie.replace(MATCH_DOMAIN_REGEXP, `; domain=${faststoreAPIHostname}`)
      )
    )
}

export const getStoreCookie = (ctx: Context) => (headers: Headers) =>
  setCookie(headers, ctx)
