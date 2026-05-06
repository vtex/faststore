import { parse } from 'cookie'
import type { GraphqlContext } from '../index'

export interface ContextForCookies {
  headers: GraphqlContext['headers']
  storage: Pick<GraphqlContext['storage'], 'cookies'>
}

/**
 * Normalizes cookie string by removing duplicates and keeping the last value for each key
 * Example: "key1=value1; key2=value2; key1=value3" -> "key2=value2; key1=value3"
 */
const normalizeCookies = (cookieString: string): string => {
  if (!cookieString) {
    return cookieString
  }

  const cookieMap = new Map<string, string>()
  const cookies = cookieString.split(';')
  const processedKeys: string[] = []

  // Process cookies to build map with last values and track order
  cookies.forEach((cookie) => {
    const trimmedCookie = cookie.trim()
    if (trimmedCookie) {
      const equalIndex = trimmedCookie.indexOf('=')
      if (equalIndex > 0) {
        const key = trimmedCookie.substring(0, equalIndex)
        const value = trimmedCookie.substring(equalIndex + 1)

        // If this is the first time we see this key, record its position
        if (!cookieMap.has(key)) {
          processedKeys.push(key)
        }

        cookieMap.set(key, value)
      }
    }
  })

  // Rebuild cookie string maintaining the order of first appearance
  return processedKeys.map((key) => `${key}=${cookieMap.get(key)}`).join('; ')
}

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
export const updatesContextStorageCookies = (
  ctx: Pick<GraphqlContext, 'storage'>,
  setCookieValue: string
) => {
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

export const setCookie = (
  ctx: Pick<GraphqlContext, 'storage'>,
  headers: Headers
) => {
  headers
    .getSetCookie()
    .forEach((setCookieValue) =>
      updatesContextStorageCookies(ctx, setCookieValue)
    )
}

export const getStoreCookie =
  (ctx: Pick<GraphqlContext, 'storage'>) => (headers: Headers) =>
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
export const getUpdatedCookie = (ctx: ContextForCookies) => {
  if (!ctx.headers?.cookie) {
    return null
  }

  // Normalize cookies to handle duplicates (keep last value)
  const normalizedCookie = normalizeCookies(ctx.headers.cookie)
  const contextStorageCookies = Array.from(ctx.storage.cookies.entries())

  if (contextStorageCookies.length === 0) {
    return normalizedCookie
  }

  return contextStorageCookies.reduce(
    (existingCookies, [storageCookieKey, { value: storageCookieValue }]) =>
      updatesCookieValueByKey(
        existingCookies,
        storageCookieKey,
        storageCookieValue
      ),
    normalizedCookie
  )
}

export const getWithCookie = (ctx: ContextForCookies) =>
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

export const getAuthCookie = (cookies: string, account: string) => {
  const normalizedCookies = normalizeCookies(cookies)
  const parsedCookies = parse(normalizedCookies)
  const authCookie = parsedCookies[`VtexIdclientAutCookie_${account}`]
  return authCookie || ''
}

export const getWithAutCookie = (ctx: ContextForCookies) => {
  const withCookie = getWithCookie(ctx)

  return function withAutCookie(forwardedHost: string, account: string) {
    const headers: HeadersInit = withCookie({
      'content-type': 'application/json',
      'X-FORWARDED-HOST': forwardedHost,
    })

    const VtexIdclientAutCookie = getAuthCookie(
      ctx?.headers?.cookie ?? '',
      account
    )
    headers['VtexIdclientAutCookie'] = VtexIdclientAutCookie

    return headers
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
      cookieParts[0],
      `${cookieParts[1]}=${storageCookieValue}`
    )
  }

  // add new storage cookie to the original list of cookies
  return `${existingCookies};${storageCookieKey}=${storageCookieValue}`
}

export function parseJwt(token: string) {
  if (!token) {
    return null
  }
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
}
