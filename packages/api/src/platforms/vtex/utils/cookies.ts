import type { Context } from '../index'

export interface ContextForCookies {
  headers: Context['headers']
  storage: Pick<Context['storage'], 'cookies'>
}

const MATCH_FIRST_SET_COOKIE_KEY_VALUE = /^([^=]+)=([^;]*)/

/**
 * Splits a combined `set-cookie` header value (cookies joined by `, `) into
 * individual cookies. Commas inside `expires=...` dates are kept.
 */
const splitSetCookieHeader = (value: string) =>
  value.split(/,(?=\s*[^;,=\s]+=)/).map((setCookie) => setCookie.trim())

/**
 * Returns every `set-cookie` value of a fetch response.
 *
 * `Headers.getSetCookie()` only exists on Node >= 18.14 (undici). FastStore v1
 * stores may still run on Node 16, where isomorphic-unfetch falls back to
 * node-fetch v2, which exposes repeated headers through `raw()` instead.
 */
export const getSetCookies = (headers: Headers): string[] => {
  const maybeHeaders = headers as Headers & {
    getSetCookie?: () => string[]
    raw?: () => Record<string, string[]>
  }

  if (typeof maybeHeaders.getSetCookie === 'function') {
    return maybeHeaders.getSetCookie()
  }

  if (typeof maybeHeaders.raw === 'function') {
    return maybeHeaders.raw()['set-cookie'] ?? []
  }

  const setCookie = headers.get('set-cookie')

  return setCookie ? splitSetCookieHeader(setCookie) : []
}

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
export const updatesContextStorageCookies = (
  ctx: Pick<Context, 'storage'>,
  setCookieValue: string
) => {
  const matchCookie = setCookieValue.match(MATCH_FIRST_SET_COOKIE_KEY_VALUE)

  if (matchCookie) {
    const cookieKey = matchCookie[1].trim()
    const cookieValue = matchCookie[2]

    ctx.storage.cookies.set(cookieKey, {
      value: cookieValue,
      setCookie: setCookieValue,
    })
  }
}

export const setCookie = (ctx: Pick<Context, 'storage'>, headers: Headers) => {
  getSetCookies(headers).forEach((setCookieValue) =>
    updatesContextStorageCookies(ctx, setCookieValue)
  )
}

export const getStoreCookie =
  (ctx: Pick<Context, 'storage'>) => (headers: Headers) =>
    setCookie(ctx, headers)

/**
 * This function returns a modified copy of the original cookie header (ctx.headers.cookie from the first request)
 * with the cookie values that comes in each request (ctx.storage.cookies).
 * If there is no cookies in storage, the ctx.headers?.cookie is used.
 * On a shopper's first request there is no cookie header yet, but the cookies
 * Checkout set in earlier calls of the same request must still be sent, or
 * the data inserted by those calls ends up owned by a cookie nobody has.
 */
export const getUpdatedCookie = (ctx: ContextForCookies) => {
  const originalCookie = ctx.headers?.cookie ?? ''
  const contextStorageCookies = Array.from(
    ctx.storage?.cookies?.entries() ?? []
  )

  if (contextStorageCookies.length === 0) {
    return originalCookie || null
  }

  return contextStorageCookies.reduce(
    (existingCookies, [storageCookieKey, { value: storageCookieValue }]) =>
      updatesCookieValueByKey(
        existingCookies,
        storageCookieKey,
        storageCookieValue
      ),
    originalCookie
  )
}

export const getWithCookie = (ctx: ContextForCookies) =>
  function withCookie<T extends Record<string, any>>(
    headers: T
  ): T | (T & { cookie: string }) {
    const updatedCookie = getUpdatedCookie(ctx)

    if (!updatedCookie) {
      return headers
    }

    return {
      ...headers,
      cookie: updatedCookie,
    }
  }

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

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
  const MATCH_COOKIE_KEY_VALUE = new RegExp(
    `(^|;\\s*)(${escapeRegExp(storageCookieKey)})=([^;]*)`
  )
  const cookieParts = existingCookies.match(MATCH_COOKIE_KEY_VALUE)

  // replaces original cookie with the one coming from storage
  if (cookieParts) {
    return existingCookies.replace(
      MATCH_COOKIE_KEY_VALUE,
      (_, separator: string, key: string) =>
        `${separator}${key}=${storageCookieValue}`
    )
  }

  if (!existingCookies) {
    return `${storageCookieKey}=${storageCookieValue}`
  }

  // add new storage cookie to the original list of cookies
  return `${existingCookies};${storageCookieKey}=${storageCookieValue}`
}
