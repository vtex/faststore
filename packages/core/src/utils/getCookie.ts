import { parse } from 'cookie'
import type { NextApiRequest } from 'next/types'

type Params = {
  headers?: Record<string, string> | NextApiRequest['headers']
  account: string
}

const MILLISECONDS_PER_SECOND = 1000

export function getCookie(name: string): string | undefined {
  const cookieString = decodeURIComponent(document.cookie)
  const cookies = cookieString.split(';')

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=')

    if (cookieName === name) {
      return cookieValue
    }
  }

  return undefined // Cookie not found
}

/**
 * Decodes a base64url (or plain base64) string as UTF-8. Uses `atob` and
 * `TextDecoder`, which exist in browsers and Node, instead of `Buffer`, which
 * would pull a polyfill into the client bundle.
 */
function decodeBase64Url(input: string) {
  const base64 = input.replaceAll('-', '+').replaceAll('_', '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (char) => char.codePointAt(0) ?? 0)

  return new TextDecoder().decode(bytes)
}

export function parseJwt(token: string) {
  if (!token) {
    return null
  }

  try {
    return JSON.parse(decodeBase64Url(token.split('.')[1]))
  } catch {
    // Malformed structure/base64/JSON — treat the same as no token, instead
    // of throwing and 500ing the caller's request.
    return null
  }
}

export function getJWTAutCookie({ headers, account }: Params) {
  const authCookie = parse(headers?.cookie ?? '')?.[
    'VtexIdclientAutCookie_' + account
  ]
  return parseJwt(authCookie)
}

export function isExpired(exp: number): boolean {
  const now = Math.floor(Date.now() / MILLISECONDS_PER_SECOND)
  return now > exp
}
