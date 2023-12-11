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
const updatesContextStorageCookies = (ctx: Context, setCookieValue: string) => {
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

export const setCookie = (ctx: Context, headers: Headers) => {
  headers
    .getSetCookie()
    .forEach((setCookieValue) =>
      updatesContextStorageCookies(ctx, setCookieValue)
    )
}

export const getStoreCookie = (ctx: Context) => (headers: Headers) =>
  setCookie(ctx, headers)

/**
 * This function returns a modified copy of the original cookie header (ctx.headers.cookie from the first request)
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
  if (!ctx.headers?.cookie) {
    return null
  }

  const contextStorageCookies = Array.from(ctx.storage.cookies.entries())

  if (contextStorageCookies.length === 0) {
    return ctx.headers.cookie
  }

  return contextStorageCookies.reduce(
    (existingCookies, [storageCookieKey, { value: storageCookieValue }]) =>
      updatesCookieValueByKey(
        existingCookies,
        storageCookieKey,
        storageCookieValue
      ),
    ctx.headers.cookie
  )
}

export const getWithCookie = (ctx: Context) =>
  function withCookie<T extends Record<string, any>>(
    headers: T
  ): T & { cookie?: string } {
    const updatedCookie = getUpdatedCookie(ctx)

    if (!updatedCookie) {
      return headers
    }

    return {
      ...headers,
      cookie: updatedCookie,
    }
  }

/**
 * This function updates the cookie value based on its key
 *
 * const existingCookies = 'key=value1; key2=; key3=value3';
 * const storageCookieKey = 'key2';
 * const storageCookieValue = 'value2'
 *
 * updatesCookieValueByKey(existingCookies, storageCookieKey, storageCookieValue) returns 'key=value1; key2=value2; key3=value3';
 */
export const updatesCookieValueByKey = (
  existingCookies: string,
  storageCookieKey: string,
  storageCookieValue: string
) => {
  const MATCH_COOKIE_KEY_VALUE = new RegExp(`(${storageCookieKey})=([^;]*)`)
  const cookieParts = existingCookies.match(MATCH_COOKIE_KEY_VALUE)

  // replaces original cookie with the one coming from storage
  if (cookieParts) {
    return existingCookies.replace(
      MATCH_FIRST_SET_COOKIE_KEY_VALUE,
      `${cookieParts[1]}=${storageCookieValue}`
    )
  }

  // add new storage cookie to the original list of cookies
  return `${existingCookies};${storageCookieKey}=${storageCookieValue}`
}
