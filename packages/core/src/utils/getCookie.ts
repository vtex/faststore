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

export function parseJwt(token: string) {
  if (!token) {
    return null
  }
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
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
