import { parse } from 'cookie'
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import discoveryConfig from 'discovery.config'

const ADDITIONAL_COOKIES = ['CheckoutOrderFormOwnership'] as const

/**
 * Clears all cookies containing 'vtex' in the name (case-insensitive) + ADDITIONAL_COOKIES
 * This endpoint handles HttpOnly cookies that cannot be cleared via JavaScript
 */
const handler: NextApiHandler = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  if (request.method !== 'POST') {
    response.status(405).end()
    return
  }

  try {
    const hostname = request.headers.host?.split(':')[0] ?? ''
    const cookies = parse(request.headers.cookie ?? '')
    const domains = [undefined, hostname, `.${hostname}`]
    const clearedCookies: string[] = []

    const vtexCookieNames = Object.keys(cookies).filter((name) =>
      name.toLowerCase().includes('vtex')
    )

    // Clear vid_rt cookie with specific path (only if refreshToken is enabled)
    if (discoveryConfig.experimental?.refreshToken && cookies.vid_rt) {
      for (const domain of domains) {
        const domainAttr = domain ? `; domain=${domain}` : ''
        const clearedCookie = `vid_rt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; path=/api/vtexid/refreshtoken/webstore${domainAttr}; samesite=lax; httponly`
        clearedCookies.push(clearedCookie)
      }
    }

    // Clear other cookies with path /
    const otherCookieNames = [
      ...vtexCookieNames,
      ...ADDITIONAL_COOKIES.filter((name) => cookies[name]),
    ]

    for (const cookieName of otherCookieNames) {
      for (const domain of domains) {
        const domainAttr = domain ? `; domain=${domain}` : ''
        const clearedCookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; path=/${domainAttr}; samesite=lax; httponly`
        clearedCookies.push(clearedCookie)
      }
    }

    if (clearedCookies.length > 0) {
      response.setHeader('set-cookie', clearedCookies)
    }

    response.status(200).json({ success: true })
  } catch (error) {
    console.error('Error clearing cookies:', error)
    response
      .status(500)
      .json({ success: false, error: 'Failed to clear cookies' })
  }
}

export default handler
