import type { Context } from '../index'

const MATCH_FIRST_SET_COOKIE_KEY_VALUE = /^([^=]+)=([^;]*)/

/**
 * This function updates the ctx.storage.cookies, that is used in each request.
 *
 * ctx.storage.cookies is a Map<string[1], Record<string, string>[2]> where,
 * [1] cookie key
 * [2] {
 *       value: cookie value,
 *       setCookie: setCookie used in browser response
 *     }
 */
const updatesContextStorageCookies = (setCookieValue: string, ctx: Context) => {
  const matchCookie = setCookieValue.match(MATCH_FIRST_SET_COOKIE_KEY_VALUE)
  if (matchCookie) {
    const cookieKey = matchCookie[1]
    const cookieValue = matchCookie[2]

    ctx.storage.cookies.set(cookieKey, {
      value: cookieValue,
      setCookie: setCookieValue,
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
 * with the cookie values that comes in each request (ctx.storage.cookies).
 * If there is no cookies in storage, the ctx.headers?.cookie is used
 *
 * ctx.storage.cookies is a Map<string[1], Record<string, string>[2]> where,
 * [1] cookie key
 * [2] {
 *       value: cookie value,
 *       setCookie: setCookie used in browser response
 *     }
 */
export const getUpdatedCookie = (ctx: Context) => {
  const contextStorageCookies = Array.from(ctx.storage.cookies.entries())

  return contextStorageCookies.length > 0
    ? contextStorageCookies.reduce(
        (cookie, [key, { value }]) => {
          return updatesCookieValueByKey(cookie, key, value)
        },
        ctx.headers?.cookie
      )
    : ctx.headers?.cookie
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
