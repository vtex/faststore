import type { NextApiRequest } from 'next'
import type { NextRequest } from 'next/server'

function isLocalHost(host: string): boolean {
  const normalizedHost = host.toLowerCase()
  const match = new RegExp(/^\[([^\]]+)\](?::\d+)?$/).exec(normalizedHost)
  const hostname = match?.[1] ?? normalizedHost.split(':')[0] ?? ''

  return (
    hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
  )
}

/**
 * Whether the auth cookie should use the Secure attribute.
 * Browsers ignore Secure cookies on http:// (e.g. local dev), so we disable
 * Secure in development and on loopback hosts even if NODE_ENV is production.
 * Otherwise we follow x-forwarded-proto (proxies) or the request URL protocol.
 */
export function isSecureAuthCookieForMiddleware(request: NextRequest): boolean {
  if (process.env.NODE_ENV === 'development') {
    return false
  }

  const host = request.headers.get('host') ?? ''

  if (isLocalHost(host)) {
    return false
  }

  const forwarded = request.headers
    .get('x-forwarded-proto')
    ?.split(',')[0]
    ?.trim()

  if (forwarded) {
    return forwarded === 'https'
  }

  return request.nextUrl.protocol === 'https:'
}

export function isSecureAuthCookieForPagesApi(
  request: NextApiRequest
): boolean {
  if (process.env.NODE_ENV === 'development') {
    return false
  }

  const hostHeader = request.headers.host ?? ''

  if (isLocalHost(hostHeader)) {
    return false
  }

  const raw = request.headers['x-forwarded-proto']
  const forwarded = (Array.isArray(raw) ? raw[0] : raw)?.split(',')[0]?.trim()

  if (forwarded) {
    return forwarded === 'https'
  }

  return true
}
