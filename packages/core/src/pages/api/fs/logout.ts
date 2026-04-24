import { parse } from 'cookie'
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

import discoveryConfig from 'discovery.config'
import {
  expireCookieServer,
  getCookieDomains,
  getVtexCookieNames,
} from 'src/utils/clearCookies'

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
    const domains = getCookieDomains(hostname)
    const clearedCookies: string[] = []

    const vtexCookieNames = getVtexCookieNames(Object.keys(cookies))

    // Clear vid_rt cookie with specific path (only if refreshToken is enabled)
    if (discoveryConfig.experimental?.refreshToken && cookies.vid_rt) {
      for (const domain of domains) {
        const clearedCookie = expireCookieServer({
          name: 'vid_rt',
          path: '/api/vtexid/refreshtoken/webstore',
          domain,
        })
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
        const clearedCookie = expireCookieServer({
          name: cookieName,
          path: '/',
          domain,
        })
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
