import type { Context } from '../index'

const MATCH_DOMAIN_REGEXP = /(?:^|;\s*)(?:domain=)([^;]+)/i
// match the first key=value
const MATCH_COOKIE_FIRST_KEY_VALUE = /^([^=]+)=([^;]*)/

/**
 * This function updates the ctx.storage.cookies, that is used in each request.
 * It also replaces original setCookie domain for FastStore API's domain hostname.
 *
 * ctx.storage.cookies is a Map<string[1], Record<string, string>[2]> where,
 * [1] cookie key
 * [2] {
 *       value: cookie value,
 *       setCookie: setCookie used in browser response
 *     }
 */
const updatesContextStorageCookies = (setCookieValue: string, ctx: Context) => {
  const faststoreAPIHostname = new URL(`https://${ctx.headers.host}`).hostname

  const matchCookie = setCookieValue.match(MATCH_COOKIE_FIRST_KEY_VALUE)
  if (matchCookie) {
    const cookieKey = matchCookie[1]
    const cookieValue = matchCookie[2]

    // Replaces original setCookie domain for FastStore API's domain hostname
    const setCookieWithStoreDomain = setCookieValue.replace(
      MATCH_DOMAIN_REGEXP,
      `; domain=${faststoreAPIHostname}`
    )

    ctx.storage.cookies.set(cookieKey, {
      value: cookieValue,
      setCookie: setCookieWithStoreDomain,
    })
  }
}

export const setCookie = (headers: Headers, ctx: Context) => {
  headers
    .getSetCookie()
    .forEach((setCookieValue) =>
      updatesContextStorageCookies(setCookieValue, ctx)
    )
}

export const getStoreCookie = (ctx: Context) => (headers: Headers) =>
  setCookie(headers, ctx)

/**
 * This function updates the original cookie (ctx.headers.cookie from the first request)
 * with the cookie values that comes in each request (ctx.storage.cookies)
 *
 * ctx.storage.cookies is a Map<string[1], Record<string, string>[2]> where,
 * [1] cookie key
 * [2] {
 *       value: cookie value,
 *       setCookie: setCookie used in browser response
 *     }
 */
export const getUpdatedCookie = (ctx: Context) => {
  return Array.from(ctx.storage.cookies.entries()).reduce(
    (cookie, [key, { value }]) => {
      return updatesCookieValueByKey(cookie, key, value)
    },
    ctx.headers?.cookie
  )
}

/**
 * This function updates the cookie value based on its key
 *
 * const cookie = 'key=value1; key2=; key3=value3';
 * const key = 'key2';
 * const newValue = 'value2'
 *
 * updatesCookieValueByKey(cookie, key, newValue) returns 'key=value1; key2=value2; key3=value3';
 */
export const updatesCookieValueByKey = (
  cookie: string,
  key: string,
  newValue: string = ''
) => {
  const MATCH_COOKIE_KEY_VALUE = new RegExp(`(${key})=([^;]*)`)
  const match = cookie.match(MATCH_COOKIE_KEY_VALUE)

  return match
    ? cookie.replace(MATCH_COOKIE_KEY_VALUE, `${key}=${newValue}`)
    : cookie
}
